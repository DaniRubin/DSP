from spaceSgp4 import *
import random
import numpy as np
import matplotlib.pyplot as plt

def createXPoints(iPoint, tle, cyclesNumber, minutesBetween, NOW_TIME):
    allCorrectVectors = []
    for x in range(cyclesNumber):
        allCorrectVectors.append(np.array(RV_to_RV(iPoint, tle, minutesBetween*(x+1), NOW_TIME)))
    return allCorrectVectors

def createXPointsClosing(iPoint, tle, cyclesNumber, closing_rate, NOW_TIME):
    allCorrectVectors = []
    for x in range(1,cyclesNumber):
        allCorrectVectors.append(np.array(RV_to_RV(iPoint, tle, 5*(x+1)/(x**1.2), NOW_TIME)))
    return allCorrectVectors

def createXPointsFake(iPoint, tle, cyclesNumber, minutesBetween, NOW_TIME):
    allCorrectVectors = []
    for x in range(cyclesNumber):
        ans = list(map(lambda a: int(a+(x*2)), iPoint))
        allCorrectVectors.append(np.array(ans))
    return np.array(allCorrectVectors)

def createInitialPoint(originVector, r_difference, v_difference):
    initialVector = []
    for i in range(len(originVector)):
        if i < 3:
            initialVector.append(originVector[i] + random.random()*r_difference)
        else:
            initialVector.append(originVector[i] + random.random()*v_difference)
    return initialVector

def plot_data_points(data_points, size):
    fig, ax = plt.subplots(6, figsize=(30, 20))
    x = [i for i in range(1, size)]
    titles = ["X", "Y", "Z", "Vx", "Vy", "Vz"]
    for i in range(6):
        y = [d[i] for d in data_points]
        ax[i].scatter(x=x, y=y)
        ax[i].title.set_text(f"{titles[i]} data")

    plt.show()

def format_vector(vector, formation_resolution):
    formation_string = '{:.'+str(formation_resolution)+'f}'
    return [float(formation_string.format(a)) for a in vector]

def calculae_panelty(index, number_of_plots, targetPoint, tle, minutesBetween, time, allCorrectVectors, my_range):
    penalty = []
    direction_change = np.zeros(6)
    direction_change[index] = 0.001
    for j in range(-1*my_range, my_range):
        p_i = []
        newTargetPoint = np.array(targetPoint + direction_change * j)
        for x in range(number_of_plots):
            ans = RV_to_RV(newTargetPoint, tle, minutesBetween * (x + 1), time)
            p_i.append(np.array(ans))

        new_array = []
        for counter in range(len(p_i)):
            new_array.append(np.linalg.norm(p_i[counter] - allCorrectVectors[counter]))
        if(j == 0):
            print(new_array)
        penalty.append(np.average(new_array))
    return penalty

def plot_penalty(targetPoint, tle, time):
    my_range = 200
    number_of_plots = 10
    minutesBetween = 60
    allCorrectVectors = createXPoints(targetPoint, tle, number_of_plots, minutesBetween, time)
    unwanted_answer = np.linalg.norm([x - y for x in [np.zeros(6)]*10 for y in allCorrectVectors])
    print(unwanted_answer)
    titles = ["X", "Y", "Z", "Vx", "Vy", "Vz"]

    index = 4
    penalty = calculae_panelty(index, number_of_plots, targetPoint, tle, minutesBetween, time, allCorrectVectors, my_range)
    print("Minimal value is - ", min(penalty))
    for u in range(-1*my_range, my_range):
        print(u, penalty[u+my_range])
    # print(penalty)
    # penalty = list(map(lambda x: x if not 1400<int(x)<1600 and not unwanted_answer-100<int(x)<unwanted_answer+100 else -50000, penalty))

    plt.scatter(x=[i for i in range(-1*my_range, my_range)], y=penalty)
    plt.title(titles[index])
    # fig, ax = plt.subplots(6, figsize=(30, 20))

    # for i in range(6):
    #     penalty = calculae_panelty(i, number_of_plots, targetPoint, tle, minutesBetween, time, allCorrectVectors, my_range)
    #     print(f"Round number - {i}")
    #     ax[i].scatter(x=[i for i in range(-1*my_range, my_range)], y=penalty)
    #     ax[i].title.set_text(f"{titles[i]} data")
    #
    plt.show()
