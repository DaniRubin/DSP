# Dani Sivan Predictor

import matplotlib.pyplot as plt
from datetime import datetime
# from scipy.optimize import minimize, least_squares


from modules import *

globalCounter = 0
failCounter = 0
NOW_TIME = datetime(2020, 9, 3)
ORIGIN_TLE = '1 41771U 16058B   20247.00000000  .00003819  00000-0  10347-3 0  9990\n2 41771  97.1931  41.8590 ' \
                '0002406  85.0989 275.0531 15.38249595234081 '

def optimizationFunction(vec):
    global globalCounter
    global failCounter
    newVectors = createXPoints(vec, ORIGIN_TLE, 10, 3, NOW_TIME)
    answers = []
    for index in range(len(newVectors)):
        if np.array_equal(newVectors[index], np.zeros(6)):
            failCounter += 1
        answers.append(np.linalg.norm(newVectors[index][0:3] - allCorrectVectors[index][0:3]))
    globalCounter += 1
    print(globalCounter, ". - ", np.array(answers).astype(int))
    return np.array(answers)


if __name__ == '__main__':

    targetPoint = TLE_to_RV(ORIGIN_TLE, 0, NOW_TIME)

    allCorrectVectors = createXPoints(targetPoint, ORIGIN_TLE, 200, 1, NOW_TIME)
    initialGuess = createInitialPoint(targetPoint, 500, 0.2)

    format_real_vectors = [[float('{:.4f}'.format(a)) for a in vec] for vec in allCorrectVectors]


    ###############################################################################
    ############################ Data plotting ####################################
    ###############################################################################
    # plot_data_points(format_real_vectors, 200)
    plot_penalty(targetPoint, ORIGIN_TLE, NOW_TIME)

    ###############################################################################
    ############################### Optimizer #####################################
    ###############################################################################
    # res = least_squares(optimizationFunction, np.array(initialGuess), method='lm')
    # optimizationFunction(initialGuess)
    # print("targetPoint")
    # print(targetPoint)
    # print("initialGuess")
    # print(initialGuess)
    # finalAnswer = [x for x in res.x]
    # print("finalAnswer")
    # print(finalAnswer)
    # print(res)
