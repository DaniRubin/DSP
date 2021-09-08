from spaceSgp4 import *
import random
import numpy as np
import matplotlib.pyplot as plt


def create_target_points(initial_vector, TLE, cycles_number, minutes_between_cycles, initial_time):
    correct_vectors = []
    for x in range(cycles_number):
        # print(f'Creating  vector number {x}')
        correct_vectors.append(
            np.array(RV_to_RV(initial_vector, TLE, minutes_between_cycles * (x + 1), initial_time)))
    return correct_vectors

def create_initial_point(origin_vector, r_diff, v_diff):
    initial_vector = []
    for i in range(len(origin_vector)):
        if i < 3:
            initial_vector.append(origin_vector[i] + random.random() * r_diff)
        else:
            initial_vector.append(origin_vector[i] + random.random() * v_diff)
    return initial_vector

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
    formation_string = '{:.' + str(formation_resolution) + 'f}'
    return [float(formation_string.format(a)) for a in vector]

def remove_unwanted(correct_vectors, penalty):
    unwanted_answer = np.linalg.norm([x - y for x in [np.zeros(6)] * 10 for y in correct_vectors])
    print('unwanted answer is - ', unwanted_answer)
    penalty = list(map(lambda x: x if not 1400<int(x)<1600 and not unwanted_answer-100<int(x)<unwanted_answer+100 else -50000, penalty))
    return penalty

def print_statistics(penalty, my_range):
    print("Minimal value is - ", min(penalty))
    for u in range(-1 * my_range, my_range):
        print(u, penalty[u + my_range])

def calculae_panelty(index, number_of_plots, target_point, tle, time_delta, current_time, correct_vectors, my_range):
    penalty = []
    direction_change = np.zeros(6)
    direction_change[index] = 0.001
    for j in range(-1 * my_range, my_range):
        p_i = []
        new_target_point = np.array(target_point + direction_change * j)
        for x in range(number_of_plots):
            ans = RV_to_RV(new_target_point, tle, time_delta * (x + 1), current_time)
            p_i.append(np.array(ans))

        new_array = []
        for counter in range(len(p_i)):
            new_array.append(np.linalg.norm(p_i[counter] - correct_vectors[counter]))
        penalty.append(np.average(new_array))
    return penalty

def plot_penalty(target_point, tle, time, index, SINGLE_GRAPH=True):
    TITLES = ["X", "Y", "Z", "Vx", "Vy", "Vz"]
    my_range = 200
    number_of_plots = 10
    minutes_delta = 1

    correct_vectors = create_target_points(initial_vector=target_point, TLE=tle, cycles_number=number_of_plots,
                                           minutes_between_cycles=minutes_delta, initial_time=time)

    if SINGLE_GRAPH:
        penalty = calculae_panelty(index, number_of_plots, target_point, tle, minutes_delta, time, correct_vectors,
                                   my_range)
        print_statistics(penalty, my_range)
        plt.scatter(x=[i for i in range(-1 * my_range, my_range)], y=penalty)
        plt.title(TITLES[index])
    else:
        fig, ax = plt.subplots(6, figsize=(30, 20))
        for i in range(6):
            penalty = calculae_panelty(i, number_of_plots, target_point, tle, minutes_delta, time, correct_vectors, my_range)
            print(f"Round number - {i}")
            ax[i].scatter(x=[i for i in range(-1*my_range, my_range)], y=penalty)
            ax[i].title.set_text(f"{TITLES[i]} data")

    plt.show()

def propagate_kepler(initial_vector, TLE, samples_amount, time_delta, initial_time, title_addition=''):
    propagated_vectors = create_target_points(initial_vector=initial_vector, TLE=TLE, cycles_number=samples_amount,
                                           minutes_between_cycles=time_delta, initial_time=initial_time)

    propagated_vectors_kepler = []
    success_samples_amount = 0
    try:
        for vec in propagated_vectors:
            propagated_vectors_kepler.append(RV_to_kepler(vec))
            success_samples_amount += 1
    except:
        print(f"Stoped at counter {success_samples_amount}")
    # propagated_vectors_kepler = [RV_to_kepler(vec) for vec in propagated_vectors]
    fig, ax = plt.subplots(6, figsize=(30, 20))
    fig.suptitle(f'Kepler propagation with {time_delta} minutes and {success_samples_amount}/{samples_amount} successful samples {title_addition}')

    TITLES = list(propagated_vectors_kepler[0].keys())
    TITLES.remove('PSemiMajorAxis')

    for i in range(len(TITLES)):
        print(i, TITLES[i])
        ax[i].scatter(x=[i for i in range(success_samples_amount)], y=[d[TITLES[i]] for d in propagated_vectors_kepler])
        ax[i].title.set_text(f"{TITLES[i]} data")
    plt.show()

