from scipy.optimize import least_squares
import numpy as np

POINTS_SPACE_SIZE = 1000000
PROBLEM_DIMENSIONS = 6
ITERATION_NUMBER = 1
NUMBER_OF_STATIONS = 10
targetStation = None
initialStations = None
diArray = None


def calculate_distance(vec):
    results = []
    for initialStation in initialStations:
        results.append(np.linalg.norm(initialStation - vec))
    return np.array(results)


def optimization_func(vec):
    return calculate_distance(vec) - diArray

def print_space_point(num):
    return [round(x, 3) for x in num]

def checkEquality(target, ans):
    new_target = np.array([int(num) for num in target])
    new_ans = np.array([int(num) for num in ans])
    return new_ans == new_target


if __name__ == '__main__':
    successCounter = 0
    offCounter = 0
    for x in range(ITERATION_NUMBER):
        initialStations = []
        for index in range(NUMBER_OF_STATIONS):
            initialStations1 = (np.random.rand(int(PROBLEM_DIMENSIONS / 2)) * 1000000)
            initialStations2 = (np.random.rand(int(PROBLEM_DIMENSIONS / 2)) * 5)
            initialStations.append(np.concatenate((initialStations1, initialStations2), axis=0))

        targetStation1 = (np.random.rand(int(PROBLEM_DIMENSIONS / 2)) * 1000000)
        targetStation2 = (np.random.rand(int(PROBLEM_DIMENSIONS / 2)) * 5)
        targetStation = np.concatenate((targetStation1, targetStation2), axis=0)

        diArray = calculate_distance(targetStation)
        initialPoint = np.random.randint(100000, size=PROBLEM_DIMENSIONS)

        res = least_squares(optimization_func, initialPoint, method='lm').x

        resultFit = np.sum(checkEquality(targetStation, res))
        if resultFit >= 3:
            successCounter += 1
        if resultFit == 6:
            offCounter += 1

        print(f"{x+1}* initialStations - {[print_space_point(point) for point in initialStations]}")
        print(f"{x+1}* targetStation - {print_space_point(targetStation)}")
        print(f"{x+1}* initialPoint - {print_space_point(initialPoint)}")
        print(f"{x+1}* result - {print_space_point(res)}")
        print(f"{x+1}* result fits expectations - {bool(resultFit)}. Correct answers - {resultFit} \n")

    print("Total successes is - %s" % str(successCounter))
    print("Total off results is - %s" % str(offCounter))



