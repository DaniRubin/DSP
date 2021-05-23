#Dani Sivan Predictor

import os
import sys
from datetime import datetime, timedelta
from sgp4.api import Satrec
from sgp4.api import jday
import random
import math 
import numpy as np
from scipy.optimize import minimize


#Helpers RV to Kepler
def vectoricalMultiple(mat1, mat2):
    return [
        mat1[1] * mat2[2] - mat1[2] * mat2[1],
        mat1[2] * mat2[0] - mat1[0] * mat2[2],
        mat1[0] * mat2[1] - mat1[1] * mat2[0]
    ]
def getMagnitudeOfMetrix(mat):
    return math.sqrt((math.pow(mat[0], 2) + math.pow(mat[1], 2) + math.pow(mat[2], 2)))
def degreeToRadians(degree): 
    return degree / 57.2958;
def radianToDegree(radian):
    return radian * 57.2958;
def multipleScalarAndVector(mat, scalar):
    return [mat[0] * scalar, mat[1] * scalar, mat[2] * scalar];
def scalaricMultiple(mat1, mat2):
    return (mat1[0] * mat2[0]) + (mat1[1] * mat2[1]) + (mat1[2] * mat2[2])
def vectoricalSubtraction(mat1, mat2):
    return [mat1[0] - mat2[0], mat1[1] - mat2[1], mat1[2] - mat2[2]]

#Helpers Kepler to TLE
def createValidAngle(angle):
    finalAngle = str(angle);
    if (angle < 10):
        finalAngle = "   " + finalAngle;
    elif (angle > 100):
        finalAngle = " " + finalAngle;
    else:
        finalAngle = "  " + finalAngle;
    return finalAngle;
def getThis_JD_FR(now, numberOfMinutesFromNow):
	time = now + timedelta(minutes = numberOfMinutesFromNow)
	return jday(time.year, time.month, time.day, time.hour, time.minute, time.second)


def Kepler_to_TLE(kepler, Config, catalogNumber):
    TLEsecondLine = "";
    ecc = float(kepler.get('eccentricity'));
    TLEsecondLine += "2 " + catalogNumber + createValidAngle(float("%.4f" % kepler.get('inclination')))
    TLEsecondLine += createValidAngle(float("%.4f" % kepler.get('ascendingNode'))) + " "
    TLEsecondLine += ("%.7f" % kepler.get('eccentricity')).split('.')[1] + createValidAngle(float("%.4f" % kepler.get('argumantPerigee')))
    topPart = math.cos(degreeToRadians(kepler.get('trueAnomaly'))) + ecc;
    bottomPart = 1 + ecc * math.cos(degreeToRadians(kepler.get('trueAnomaly')));
    eccetricAnomaly = radianToDegree(math.acos(topPart / bottomPart));
    meanAnomaly = eccetricAnomaly - ecc * math.sin(degreeToRadians(eccetricAnomaly));
    if (kepler.get('trueAnomaly') < 0):
        meanAnomaly = 360 - meanAnomaly;
    TLEsecondLine += createValidAngle(float("%.4f" % meanAnomaly)) + " ";
    meanMotion = (86400 / (2 * math.pi)) * math.sqrt((Config.get('gravitaionalConstentEarth')) / math.pow(kepler.get('semiMajorAxis'), 3));
    TLEsecondLine += str(meanMotion)[0:11] + " ";
    # print('result of Kepler_to_TLE - ',TLEsecondLine)
    return TLEsecondLine;
   
def RV_to_keplar(vector, Config):
    Rvector = [vector[0], vector[1], vector[2]]
    Vvector = [vector[3], vector[4], vector[5]]
    Hvector = vectoricalMultiple(Rvector, Vvector)
    Nvector = vectoricalMultiple([0, 0, 1], Hvector)
    inclination = radianToDegree(math.acos((Hvector[2] / getMagnitudeOfMetrix(Hvector))));
    tempValue = ((math.pow(getMagnitudeOfMetrix(Vvector), 2) / 2) - (Config.get('gravitaionalConstentEarth')/ getMagnitudeOfMetrix(Rvector)));
    semiMajorAxis = ((-1*Config.get('gravitaionalConstentEarth')) / (2 * tempValue));
    if (semiMajorAxis < 0):
        semiMajorAxis *= -1
    temp1 = multipleScalarAndVector(Rvector, (math.pow(getMagnitudeOfMetrix(Vvector), 2) - (Config.get('gravitaionalConstentEarth') / getMagnitudeOfMetrix(Rvector))));
    temp2 = multipleScalarAndVector(Vvector, scalaricMultiple(Rvector, Vvector));
    Evector = multipleScalarAndVector(vectoricalSubtraction(temp1, temp2), (1 / Config.get('gravitaionalConstentEarth')));
    eccentricity = getMagnitudeOfMetrix(Evector);
    # TO CHANGE!!!
    if (eccentricity > 1):
        eccentricity = 0.0007721;
    ascendingNode = radianToDegree(math.acos((Nvector[0] / getMagnitudeOfMetrix(Nvector))));
    if (Nvector[1] < 0):
        ascendingNode = 360 - ascendingNode;
    temp1 = (scalaricMultiple(Nvector, Evector));
    temp2 = getMagnitudeOfMetrix(Nvector) * getMagnitudeOfMetrix(Evector);
    argumantPerigee = radianToDegree(math.acos(temp1 / temp2));
    if (Evector[2] < 0):
        argumantPerigee = 360 - argumantPerigee;

    temp1 = (scalaricMultiple(Evector, Rvector));
    temp2 = getMagnitudeOfMetrix(Evector) * getMagnitudeOfMetrix(Rvector);
    trueAnomaly = radianToDegree(math.acos(temp1 / temp2));
    if (scalaricMultiple(Rvector, Vvector) < 0):
        trueAnomaly = 360 - trueAnomaly;
    if (trueAnomaly > 180):
        trueAnomaly = trueAnomaly - 360;
    
    result = {
        'inclination': inclination,
        'semiMajorAxis': semiMajorAxis,
        'eccentricity': eccentricity,
        'ascendingNode': ascendingNode,
        'argumantPerigee': argumantPerigee,
        'trueAnomaly': trueAnomaly
    }
    # print('RV_to_keplar result: ', result)
    return result
    
def TLE_to_spacePoint(tle, timeDiff, now):
    satellite = Satrec.twoline2rv(tle.split('\n')[0], tle.split('\n')[1])
    jd,fr = getThis_JD_FR(now, timeDiff)
    e, r, v = satellite.sgp4(jd, fr)
    newVector = False;
    if(e!=0): 
        print("Bad error accured :( ")
    else:
        newVectorObj = {
            "Ri": r[0],
            "Rj": r[1],
            "Rk": r[2],
            "Vi": v[0],
            "Vj": v[1],
            "Vk": v[2]
        }
        newVector = [r[0],r[1],r[2],v[0],v[1],v[2]]
    return newVector;
 
def RV_to_POINT(vector, Config, originTLE, minutesToPoint, now, toPrint = False):
    kepler = RV_to_keplar(vector, Config)
    tle = originTLE.split('\n')[0] + '\n' + Kepler_to_TLE(kepler, Config, originTLE.split('\n')[1].split(' ')[1])
    # print('after Kepler to TLE \n', tle, '\n')
    point = TLE_to_spacePoint(tle, minutesToPoint, now)
    if(toPrint):
        print('Origin RV vector - ', vector, '\n\n\n')
        print('after RV to Kepler - ', kepler, '\n\n\n')
        print('after Kepler to TLE - ', tle, '\n\n\n')
        print('after TLE to SpacePoint - ', point, '\n\n\n')
    return point

def create10Points(iPoint, tle):
    allCurectVectors = []
    for x in range(10):
        allCurectVectors.append(RV_to_POINT(iPoint, {"gravitaionalConstentEarth": 398600.4418}, tle, 90*(x+1), NOW_TIME))
    return allCurectVectors

vector = {
    'Ri': -8019.102182821201,
    'Rj': -11056.725755442074,
    'Rk': -9364.434967785259,
    'Vi': -6.86292509790261,
    'Vj': 0.777175609145837,
    'Vk': -3.4593884170022737
}
vectorVector = [-8019.102182821201, -11056.725755442074,-9364.434967785259, -6.86292509790261,0.777175609145837,-3.4593884170022737]
def createInitailPoint(originVector, Rdiff,Vdiff):
  initialVector = []
  for i in range(len(originVector)):
      if(i<3):
          initialVector.append(originVector[i] + random.random()*Rdiff)
      else:
          initialVector.append(originVector[i] + random.random()*Vdiff)
  return initialVector

TO_PRINT = False

NOW_TIME = datetime.utcnow()
originTLE = '1 46530U 20069A   20305.53669095  .00001948  00000-0  42989-4 0  9996\n2 46530  51.6471  33.7983 0001754  77.5948  44.6186 15.49359893  4418'
initialPoint = TLE_to_spacePoint(originTLE, 0, NOW_TIME)
allCurectVectors = create10Points(initialPoint, originTLE);
if (TO_PRINT):
    print("Initial Point - ", initialPoint)
    print("All 10 vectors - ", allCurectVectors)
globalCounter = 0
failCounter = 0


def cost_func(vec):
    global globalCounter
    global failCounter 
    totalSum = 0
    for i in range(len(allCurectVectors)):
        newVector = RV_to_POINT(vec, {"gravitaionalConstentEarth": 398600.4418}, originTLE, 90*(i+1), NOW_TIME)
        if(not newVector):
            failCounter+=1;
            newVector = vec
        for j in range(len(newVector)):
           totalSum += math.sqrt((newVector[j] - allCurectVectors[i][j]) ** 2)
    print("Fails - ",failCounter)
    globalCounter +=1
    print(globalCounter,". cost function - ", totalSum,'\n')
    return totalSum



# cost_func(createInitailPoint(initialPoint,0,0))

res = minimize(cost_func, createInitailPoint(initialPoint,500,0.2), method='nelder-mead')
print("Total runs - ", globalCounter)
print("Total fails - ", failCounter)
print("Fail rate - ", failCounter / (globalCounter * 10))
print("The answer is - ")
print(res.x)
print("The wanted answer - ")
print(initialPoint)




