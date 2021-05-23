import math
from datetime import timedelta
from sgp4.api import jday

def vectorMultiple(mat1, mat2):
    return [
        mat1[1] * mat2[2] - mat1[2] * mat2[1],
        mat1[2] * mat2[0] - mat1[0] * mat2[2],
        mat1[0] * mat2[1] - mat1[1] * mat2[0]
    ]

def getMagnitudeOfMatrix(mat):
    return math.sqrt((math.pow(mat[0], 2) + math.pow(mat[1], 2) + math.pow(mat[2], 2)))

def degreeToRadians(degree):
    return degree / 57.2958

def radianToDegree(radian):
    return radian * 57.2958

def multipleScalarAndVector(mat, scalar):
    return [mat[0] * scalar, mat[1] * scalar, mat[2] * scalar]

def scalarMultiple(mat1, mat2):
    return (mat1[0] * mat2[0]) + (mat1[1] * mat2[1]) + (mat1[2] * mat2[2])

def vectorSubtraction(mat1, mat2):
    return [mat1[0] - mat2[0], mat1[1] - mat2[1], mat1[2] - mat2[2]]

def createValidAngle(angle):
    finalAngle = str(angle)
    if angle < 10:
        finalAngle = "   " + finalAngle
    elif angle > 100:
        finalAngle = " " + finalAngle
    else:
        finalAngle = "  " + finalAngle
    return finalAngle

def getThis_JD_FR(now, numberOfMinutesFromNow):
    time = now + timedelta(minutes=numberOfMinutesFromNow)
    return jday(time.year, time.month, time.day, time.hour, time.minute, time.second)
