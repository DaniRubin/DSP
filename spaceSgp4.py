from spaceMath import *
from sgp4.api import Satrec

CONFIG = {"GravityConstantEarth": 398600.4418}


def RV_to_kepler(vector, Config):
    R_vector = [vector[0], vector[1], vector[2]]
    V_vector = [vector[3], vector[4], vector[5]]
    H_vector = vectorMultiple(R_vector, V_vector)
    N_vector = vectorMultiple([0, 0, 1], H_vector)
    inclination = radianToDegree(math.acos((H_vector[2] / getMagnitudeOfMatrix(H_vector))))
    tempValue = ((math.pow(getMagnitudeOfMatrix(V_vector), 2) / 2) - (
            Config.get('GravityConstantEarth') / getMagnitudeOfMatrix(R_vector)))
    semiMajorAxis = ((-1 * Config.get('GravityConstantEarth')) / (2 * tempValue))
    if semiMajorAxis < 0:
        semiMajorAxis *= -1

    P_SemiMajorAxis = math.pow(getMagnitudeOfMatrix(H_vector), 2) / Config.get('GravityConstantEarth')

    temp1 = multipleScalarAndVector(R_vector, (math.pow(getMagnitudeOfMatrix(V_vector), 2) - (
            Config.get('GravityConstantEarth') / getMagnitudeOfMatrix(R_vector))))
    temp2 = multipleScalarAndVector(V_vector, scalarMultiple(R_vector, V_vector))
    E_vector = multipleScalarAndVector(vectorSubtraction(temp1, temp2), (1 / Config.get('GravityConstantEarth')))
    eccentricity = getMagnitudeOfMatrix(E_vector)

    #     TO CHANGE!!!
    if eccentricity > 1:
        eccentricity = 0.0007721

    ascendingNode = radianToDegree(math.acos((N_vector[0] / getMagnitudeOfMatrix(N_vector))))
    if N_vector[1] < 0:
        ascendingNode = 360 - ascendingNode
    temp1 = (scalarMultiple(N_vector, E_vector))
    temp2 = getMagnitudeOfMatrix(N_vector) * getMagnitudeOfMatrix(E_vector)
    argumentPerigee = radianToDegree(math.acos(temp1 / temp2))
    if E_vector[2] < 0:
        argumentPerigee = 360 - argumentPerigee

    temp1 = (scalarMultiple(E_vector, R_vector))
    temp2 = getMagnitudeOfMatrix(E_vector) * getMagnitudeOfMatrix(R_vector)
    trueAnomaly = radianToDegree(math.acos(temp1 / temp2))
    if scalarMultiple(R_vector, V_vector) < 0:
        trueAnomaly = 360 - trueAnomaly
    if trueAnomaly > 180:
        trueAnomaly = trueAnomaly - 360

    result = {
        'inclination': inclination,
        'semiMajorAxis': semiMajorAxis,
        'PSemiMajorAxis': P_SemiMajorAxis,
        'eccentricity': eccentricity,
        'ascendingNode': ascendingNode,
        'argumentPerigee': argumentPerigee,
        'trueAnomaly': trueAnomaly
    }
    # print('RV_to_kepler result: ', result)
    return result


def Kepler_to_TLE(kepler, Config, catalogNumber):
    TLESecondLine = ""
    ecc = float(kepler.get('eccentricity'))
    TLESecondLine += "2 " + catalogNumber + createValidAngle(float("%.4f" % kepler.get('inclination')))
    TLESecondLine += createValidAngle(float("%.4f" % kepler.get('ascendingNode'))) + " "
    TLESecondLine += ("%.7f" % kepler.get('eccentricity')).split('.')[1] + createValidAngle(
        float("%.4f" % kepler.get('argumentPerigee')))
    topPart = math.cos(degreeToRadians(kepler.get('trueAnomaly'))) + ecc
    bottomPart = 1 + ecc * math.cos(degreeToRadians(kepler.get('trueAnomaly')))

    # understand why
    ans = topPart / bottomPart
    if ans > 1:
        print("HERE!")
        ans = 1

    eccentricAnomaly = radianToDegree(math.acos(ans))

    meanAnomaly = eccentricAnomaly - ecc * math.sin(degreeToRadians(eccentricAnomaly))
    if kepler.get('trueAnomaly') < 0:
        meanAnomaly = 360 - meanAnomaly
    TLESecondLine += createValidAngle(float("%.4f" % meanAnomaly)) + " "
    meanMotion = (86400 / (2 * math.pi)) * math.sqrt(
        (Config.get('GravityConstantEarth')) / math.pow(kepler.get('PSemiMajorAxis'), 3))
    TLESecondLine += str(meanMotion)[0:11] + " "
    # print('result of Kepler_to_TLE - ',TLESecondLine)
    return TLESecondLine


def TLE_to_RV(tle, timeDiff, now):
    satellite = Satrec.twoline2rv(tle.split('\n')[0], tle.split('\n')[1])
    jd, fr = getThis_JD_FR(now, timeDiff)
    e, r, v = satellite.sgp4(jd, fr)
    newVector = False
    if e == 0:
        newVector = [r[0], r[1], r[2], v[0], v[1], v[2]]
    else:
        # print("Error code is - ",e)
        pass
    return newVector


def RV_TO_TLE(vector, originTLE):
    kepler = RV_to_kepler(vector, CONFIG)
    tle = Kepler_to_TLE(kepler, CONFIG, originTLE.split('\n')[1].split(' ')[1])
    tle = originTLE.split('\n')[0] + '\n' + tle
    return tle


def RV_to_RV(vector, originTLE, minutesToPoint, now, toPrint=False):
    tle = RV_TO_TLE(vector, originTLE)
    newVector = TLE_to_RV(tle, minutesToPoint, now)
    if toPrint:
        print('Origin RV vector - ', vector, '\n\n\n')
        print('after Kepler to TLE - ', tle, '\n\n\n')
        print('after TLE to new vector - ', newVector, '\n\n\n')
    if not newVector:
        return [0, 0, 0, 0, 0, 0]
    return newVector
