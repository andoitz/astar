A* Pathfinding Algorithm Example

Algorithm that is widely used in pathfinding and graph traversal, the process of plotting an efficiently traversable path between points, called nodes.

A* Algorithm Pseudocode

function A*(start,goal)
    closedset := the empty set 
    openset := {start}
    came_from := the empty map
 
    g_score[start] := 0
    f_score[start] := g_score[start] + heuristic_cost_estimate(start, goal)
 
    while openset is not empty
        current := the node in openset having the lowest f_score[] value
        if current = goal
            return reconstruct_path(came_from, goal)
 
        remove current from openset
        add current to closedset
        for each neighbor in neighbor_nodes(current)
            if neighbor in closedset
                continue
            tentative_g_score := g_score[current] + dist_between(current,neighbor)
 
            if neighbor not in openset or tentative_g_score < g_score[neighbor] 
                came_from[neighbor] := current
                g_score[neighbor] := tentative_g_score
                f_score[neighbor] := g_score[neighbor] + heuristic_cost_estimate(neighbor, goal)
                if neighbor not in openset
                    add neighbor to openset
 
    return failure
 
function reconstruct_path(came_from, current_node)
    if current_node in came_from
        p := reconstruct_path(came_from, came_from[current_node])
        return (p + current_node)
    else
        return current_node
		

For more information and downloads visit:

http://www.andoitz.com/proyectos/programacion/34-proyectos/programacion/87-astar-pathfinding-algorithm-example.html