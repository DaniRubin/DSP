from modules import *
from main import *

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

