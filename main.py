# Dani Sivan Predictor

# import matplotlib.pyplot as plt
from datetime import datetime
from scipy.optimize import least_squares
from modules import *

global_counter = 0
fail_counter = 0
NOW_TIME = datetime(2020, 9, 3)
ORIGIN_TLE = '1 41771U 16058B   20247.00000000  .00003819  00000-0  10347-3 0  9990\n2 41771  97.1931  41.8590 ' \
             '0002406  85.0989 275.0531 15.38249595234081 '


def optimizationFunction(vec):
    global global_counter
    global fail_counter
    newVectors = create_target_points(vec, ORIGIN_TLE, 10, 3, NOW_TIME)
    answers = []
    for index in range(len(newVectors)):
        if np.array_equal(newVectors[index], np.zeros(6)):
            fail_counter += 1
        answers.append(np.linalg.norm(newVectors[index][0:3] - correct_vectors[index][0:3]))
    global_counter += 1
    print(global_counter, ". - ", np.array(answers).astype(int))
    return np.array(answers)


if __name__ == '__main__':
    # Create RV vector from TLE
    target_point = TLE_to_RV(TLE=ORIGIN_TLE, time_delta=0, current_time=NOW_TIME)
    # Create correct vectors
    correct_vectors = create_target_points(initial_vector=target_point, TLE=ORIGIN_TLE, cycles_number=200,
                                           minutes_between_cycles=1, initial_time=NOW_TIME)
    # Creates inital point
    initial_guess = create_initial_point(origin_vector=target_point, r_diff=500, v_diff=0.2)

    format_real_vectors = [[float('{:.4f}'.format(a)) for a in vec] for vec in correct_vectors]

    ###############################################################################
    ############################ Data plotting ####################################
    ###############################################################################
    plot_penalty(target_point, ORIGIN_TLE, NOW_TIME)

    ###############################################################################
    ############################### Optimizer #####################################
    ###############################################################################
    OPTIMIZE = False
    if OPTIMIZE:
        res = least_squares(optimizationFunction, np.array(initial_guess), method='lm')
        print("targetPoint")
        print(target_point)
        print("initialGuess")
        print(initial_guess)
        final_answer = [x for x in res.x]
        print("finalAnswer")
        print(final_answer)
        print(res)
