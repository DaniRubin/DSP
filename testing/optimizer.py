import numpy as np
from scipy.optimize import minimize

def cost_func(vec):
    sum = np.sum((vec-np.array([1,2,3,4,5,6]))**2)
    print(sum)
    return sum


x0 = np.random.rand(6)
print(x0)
# cost_func([-1,0,1,2,3,4])

res = minimize(cost_func, x0, method='nelder-mead')
print(res)