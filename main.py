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
    print(f"{global_counter}. {[float('{:.4f}'.format(a)) for a in vec]}")
    newVectors = create_target_points(initial_vector=vec, TLE=ORIGIN_TLE, cycles_number=10, minutes_between_cycles=1, initial_time=NOW_TIME)
    answers = []
    for index in range(len(newVectors)):
        if np.array_equal(newVectors[index], np.zeros(6)):
            fail_counter += 1
        answers.append(np.linalg.norm(newVectors[index][0:3] - correct_vectors[index][0:3]))
    global_counter += 1
    # print(f"{global_counter}. - {np.array(answers).astype(int)}. Fails - {fail_counter}")
    return np.array(answers)


if __name__ == '__main__':
    # Create RV vector from TLE
    target_point = TLE_to_RV(TLE=ORIGIN_TLE, time_delta=0, current_time=NOW_TIME)
    # Create correct vectors
    correct_vectors = create_target_points(initial_vector=target_point, TLE=ORIGIN_TLE, cycles_number=10,
                                           minutes_between_cycles=1, initial_time=NOW_TIME)
    # Creates inital point
    initial_guess = create_initial_point(origin_vector=target_point, r_diff=100, v_diff=0.005)

    format_real_vectors = [[float('{:.4f}'.format(a)) for a in vec] for vec in correct_vectors]

    ###############################################################################
    ############################ Data Locating ####################################
    ###############################################################################
    # Create correct vectors
    DATA_LOCATING = True
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
    if(DATA_PROPAGATION):
        # Create correct vectors
        correct_vectors = create_target_points(initial_vector=target_point, TLE=ORIGIN_TLE, cycles_number=200,
                                           minutes_between_cycles=1, initial_time=NOW_TIME)
        temp_target_point = target_point.copy()
        move_by = -390.2
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
        # index = 0
        # move_by = 250
        # initial_guess[index] = initial_guess[index] + move_by

        res = least_squares(fun=optimizationFunction, x0=np.array(initial_guess), diff_step=1, method='lm')
        print("targetPoint")
        print(target_point)
        print("initialGuess")
        print(initial_guess)
        final_answer = [x for x in res.x]
        print("finalAnswer")
        print(final_answer)
        # print(res)
