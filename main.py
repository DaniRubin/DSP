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


def increateVelocity(vec):
    return np.array([vec[0], vec[1], vec[2], vec[3] * 1000, vec[4] * 1000, vec[5] * 1000])


def decreaseVelocity(vec):
    return np.array([vec[0], vec[1], vec[2], vec[3] / 1000, vec[4] / 1000, vec[5] / 1000])


def optimizationFunction(vec):
    global global_counter
    global fail_counter
    # print(f"{global_counter}. {[float('{:.4f}'.format(a)) for a in vec]}")
    newVectors = create_target_points(initial_vector=decreaseVelocity(vec), TLE=ORIGIN_TLE,
                                      cycles_number=10, minutes_between_cycles=10, initial_time=NOW_TIME)
    answers = []
    for index in range(len(newVectors)):
        if np.array_equal(newVectors[index], np.zeros(6)):
            fail_counter += 1
        answers.append(np.linalg.norm(
            increateVelocity(newVectors[index]) - increateVelocity(correct_vectors[index])))
    global_counter += 1
    # print(f"{global_counter}. - {np.array(answers).astype(int)}. Fails - {fail_counter}")
    print(f"{global_counter}. {[float('{:.4f}'.format(a)) for a in answers]}")
    return np.array(answers)


INDEX = 2


def optimizationFunctionPartOne(vec):
    global global_counter
    global fail_counter
    # print(f"{global_counter}. {[float('{:.4f}'.format(a)) for a in vec]}")

    newVec = target_point.copy()
    newVec[INDEX] = vec[0]

    newVectors = create_target_points(initial_vector=newVec, TLE=ORIGIN_TLE,
                                      cycles_number=10, minutes_between_cycles=10, initial_time=NOW_TIME)
    answers = []
    for index in range(len(newVectors)):
        if np.array_equal(newVectors[index], np.zeros(6)):
            fail_counter += 1
        answers.append(np.linalg.norm(
            increateVelocity(newVectors[index]) - increateVelocity(correct_vectors[index])))
    global_counter += 1
    # print(f"{global_counter}. - {np.array(answers).astype(int)}. Fails - {fail_counter}")
    print(f"{global_counter}. {[float('{:.4f}'.format(a)) for a in answers]}")
    return np.array(answers)


if __name__ == '__main__':
    # Create RV vector from TLE
    target_point = TLE_to_RV(TLE=ORIGIN_TLE, time_delta=0, current_time=NOW_TIME)

    # Create correct vectors
    correct_vectors = create_target_points(initial_vector=target_point, TLE=ORIGIN_TLE, cycles_number=10,
                                           minutes_between_cycles=10, initial_time=NOW_TIME)
    # Creates initial point
    initial_guess = create_initial_point(origin_vector=target_point, r_diff=1000, v_diff=0)

    format_real_vectors = [[float('{:.4f}'.format(a)) for a in vec] for vec in correct_vectors]

    ###############################################################################
    ############################ Data Locating ####################################
    ###############################################################################
    # Create correct vectors
    DATA_LOCATING = False
    if (DATA_LOCATING):
        correct_vectors = create_target_points(initial_vector=target_point, TLE=ORIGIN_TLE, cycles_number=1440,
                                               minutes_between_cycles=2, initial_time=NOW_TIME)
        # print([[float('{:.4f}'.format(a)) for a in vec] for vec in correct_vectors])
        current_point = [4442.68, 3085.647, 3368.502]
        distances = []
        for vec in correct_vectors:
            distances.append(np.linalg.norm(vec[0:3] - current_point))

        print(distances)

        plt.scatter(x=[i for i in range(len(correct_vectors))], y=distances)
        plt.show()

        # .scatter(x=[i for i in range(success_samples_amount)], y=[d[TITLES[i]] for d in propagated_vectors_kepler])

    ###############################################################################
    ########################## Data Propogation ###################################
    ###############################################################################
    # Create correct vectors
    DATA_PROPAGATION = False
    if (DATA_PROPAGATION):
        # Create correct vectors
        correct_vectors = create_target_points(initial_vector=target_point, TLE=ORIGIN_TLE, cycles_number=200,
                                               minutes_between_cycles=1, initial_time=NOW_TIME)
        temp_target_point = target_point.copy()
        move_by = -190.2
        index = 2
        # index 0 move_by ===>  -172.8 < index < 5258
        # index 1 move_by ===>  -194.8 < index < 6357
        # index 2 move_by ===>  -390.2 < index < 398
        # index 3 move_by ===>  -0.0444 < index < 0.0707
        # index 4 move_by ===>  -0.0495 < index < 0.0765
        # index 5 move_by ===>  -0.0216 < index < 0.0220

        target_point[index] = target_point[index] + move_by
        propagate_kepler(target_point, ORIGIN_TLE, samples_amount=1440, time_delta=1, initial_time=NOW_TIME,
                         title_addition=f"and initial vector move of {move_by}")
        print(temp_target_point)
        print(target_point)

    ###############################################################################
    ############################ Data plotting ####################################
    ###############################################################################
    PLOT = False
    if PLOT:
        plot_penalty(target_point, ORIGIN_TLE, NOW_TIME, index=0, SINGLE_GRAPH=False)

    ###############################################################################
    ############################### Optimizer #####################################
    ###############################################################################
    OPTIMIZE = False
    if OPTIMIZE:
        # initial_guess = target_point.copy()
        # index = 2
        # move_by = 100
        # initial_guess[index] = initial_guess[index] + move_by

        # res = least_squares(fun=optimizationFunction, x0=increateVelocity(np.array(initial_guess)), f_scale=0.1,
        #                     method='lm')
        diff = 800
        res = least_squares(fun=optimizationFunctionPartOne, x0=np.array((target_point[INDEX] + diff)),
                            method='lm')
        print("targetPoint")
        print(target_point)
        # print("initialGuess")
        # print(initial_guess)
        print("Initial guess")
        print(np.array((target_point[INDEX] + diff)))

        final_answer = [x for x in res.x]
        print("finalAnswer")
        print(final_answer)
        # print(res)

    ###############################################################################
    ####################### OPTIMIZER ONE ELEMENT #################################
    ###############################################################################
    # Optimization for only one parameter
    if True:
        finalAnswers = {}
        successCounter = 0
        for i in range(-20, 20):
            res = least_squares(fun=optimizationFunctionPartOne, x0=np.array((target_point[INDEX] + i * 50)),
                                method='lm')
            finalAnswers[i * 50] = res.x
            if abs(res.x - target_point[INDEX]) < 100:
                successCounter += 1
        print(finalAnswers)
        print("Success counter is - ", successCounter)
