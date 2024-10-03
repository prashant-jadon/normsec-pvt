**Fractional Knapsack**
======================

The fractional knapsack problem is a variation of the classic 0/1 knapsack problem. In this version, instead of selecting items with whole weight capacities to maximize value, we can select fractions of these items.

**Introduction**
---------------

In this chapter, we will explore the fractional knapsack problem and its applications in computer science. We'll discuss the problem's definition, importance, and solution strategies.

**Chapter Outline**
-------------------

*   Introduction
    *   Problem Definition
    *   Importance
*   Mathematical Formulation
    *   Objective Function
    *   Constraints
*   Solution Strategies
    *   Greedy Algorithm
    *   Dynamic Programming
*   Code Implementation
*   Applications

**Key Concepts**
---------------

*   **Fractional Knapsack**: A problem where we select fractions of items to maximize value, given a knapsack capacity constraint.
*   **Knapsack Problem**: A classic problem in computer science where we choose a subset of items to include in a collection (knapsack) such that the total weight does not exceed a given limit.

**Mathematical Formulation**
---------------------------

### Objective Function

The goal is to maximize the value of the selected fractions:

```python
def objective_function(values, weights, capacity):
    n = len(values)
    profit_values = [v/w for v,w in zip(values, weights)]
    sorted_indices = sorted(range(n), key=lambda i: profit_values[i], reverse=True)
    selected_fractions = []
    
    for idx in sorted_indices:
        fraction_weight = min(capacity, weights[idx])
        capacity -= fraction_weight
        selected_fractions.append((idx, fraction_weight * values[idx]))
        
        if capacity == 0:
            break
    
    return sum(v for _, v in selected_fractions)
```

### Constraints

*   Total weight of selected fractions should not exceed the knapsack capacity (`W`).
*   Values are non-negative integers.

**Solution Strategies**
----------------------

### Greedy Algorithm

The greedy algorithm solves the fractional knapsack problem by selecting items that give the highest value-to-weight ratio.

```python
def greedy_algorithm(values, weights, capacity):
    n = len(values)
    ratios = [v/w for v,w in zip(values, weights)]
    sorted_indices = sorted(range(n), key=lambda i: ratios[i], reverse=True)
    
    selected_fractions = []
    remaining_capacity = capacity
    
    for idx in sorted_indices:
        if weights[idx] <= remaining_capacity:
            fraction_weight = remaining_capacity
            remaining_capacity -= fraction_weight
            selected_fractions.append((idx, fraction_weight * values[idx]))
        else:
            fraction_weight = remaining_capacity
            remaining_capacity = 0
            selected_fractions.append((idx, fraction_weight * values[idx]))
    
    return sum(v for _, v in selected_fractions)
```

### Dynamic Programming

Dynamic programming is an efficient method to solve the fractional knapsack problem.

```python
def dynamic_programming(values, weights, capacity):
    n = len(values)
    dp_table = [[0.0 for _ in range(capacity + 1)] for _ in range(n + 1)]
    
    for i in range(1, n+1):
        for w in range(1, capacity+1):
            if weights[i-1] > w:
                dp_table[i][w] = dp_table[i - 1][w]
            else:
                dp_table[i][w] = max(dp_table[i - 1][w], values[i-1]/weights[i-1]*w + dp_table[i-1][w-weights[i-1]])
    
    return dp_table[n][capacity]
```

**Code Implementation**
----------------------

The above solution strategies are implemented in Python.

```python
def fractional_knapsack(values, weights, capacity):
    n = len(values)
    
    # Using Greedy Algorithm for simplicity and better performance.
    def greedy_algorithm():
        ratios = [v/w for v,w in zip(values, weights)]
        sorted_indices = sorted(range(n), key=lambda i: ratios[i], reverse=True)
        
        selected_fractions = []
        remaining_capacity = capacity
        
        for idx in sorted_indices:
            if weights[idx] <= remaining_capacity:
                fraction_weight = remaining_capacity
                remaining_capacity -= fraction_weight
                selected_fractions.append((idx, fraction_weight * values[idx]))
            else:
                fraction_weight = remaining_capacity
                remaining_capacity = 0
                selected_fractions.append((idx, fraction_weight * values[idx]))
        
        return sum(v for _, v in selected_fractions)
    
    # Using Dynamic Programming for demonstration.
    def dynamic_programming():
        n = len(values)
        dp_table = [[0.0 for _ in range(capacity + 1)] for _ in range(n + 1)]
        
        for i in range(1, n+1):
            for w in range(1, capacity+1):
                if weights[i-1] > w:
                    dp_table[i][w] = dp_table[i - 1][w]
                else:
                    dp_table[i][w] = max(dp_table[i - 1][w], values[i-1]/weights[i-1]*w + dp_table[i-1][w-weights[i-1]])
        
        return dp_table[n][capacity]

    # Compute the fractional knapsack solution.
    solution_greedy = greedy_algorithm()
    solution_dp = dynamic_programming()

    print("Greedy Algorithm Solution:", solution_greedy)
    print("Dynamic Programming Solution:", solution_dp)

# Example usage
values = [60, 100, 120]
weights = [10, 20, 30]
capacity = 50

fractional_knapsack(values, weights, capacity)
```

**Applications**
-----------------

The fractional knapsack problem has various applications in:

*   **Finance**: Portfolio optimization and asset allocation.
*   **Logistics**: Vehicle routing and load planning.
*   **Supply Chain Management**: Inventory management and production planning.

Note: This example implementation assumes values and weights are non-negative integers, representing monetary amounts.
