**Lesson: Linked Lists in C++**

### Overview

A linked list is a data structure in which elements are stored as separate objects, and each element points to the next one. This allows for efficient 
insertion or deletion of elements at any position in the list. In this lesson, we will explore how to implement a linked list in C++, as well as 
different types of linked lists.

### What is a Linked List?

A linked list consists of a sequence of nodes, each containing a value and a reference (or "link") to the next node in the list. This structure allows 
for efficient insertion or deletion of elements at any position in the list, making it useful for scenarios where frequent additions or deletions are 
necessary.

### Implementing a Linked List in C++

To implement a linked list in C++, we need to define a `Node` class that represents each individual element in the list. Each node will have two 
properties:

*   `value`: stores the actual value of the node
*   `next`: points to the next node in the list

Here is an example implementation:
```cpp
// Node.h
#ifndef NODE_H
#define NODE_H

class Node {
public:
    int value;
    Node* next;

    // Constructor
    Node(int val) : value(val), next(nullptr) {}
};

#endif  // NODE_H
```

Next, we'll create a `LinkedList` class that will manage the nodes and provide methods for basic operations like insertion and deletion.
```cpp
// LinkedList.h
#ifndef LINKED_LIST_H
#define LINKED_LIST_H

#include "Node.h"

class LinkedList {
public:
    Node* head;

    // Constructor
    LinkedList() : head(nullptr) {}

    // Insert a new node at the end of the list
    void insert(int val);

    // Delete a node with a given value from the list
    void deleteValue(int val);
};

#endif  // LINKED_LIST_H
```

And here's how you can implement the `insert` and `deleteValue` methods:
```cpp
// LinkedList.cpp
#include "LinkedList.h"
#include "Node.h"

void LinkedList::insert(int val) {
    Node* newNode = new Node(val);

    if (head == nullptr) {
        head = newNode;
        return;
    }

    Node* current = head;

    while (current->next != nullptr) {
        current = current->next;
    }

    current->next = newNode;
}

void LinkedList::deleteValue(int val) {
    if (head == nullptr) return;

    if (head->value == val) {
        delete head;
        head = nullptr;
        return;
    }

    Node* current = head;

    while (current->next != nullptr) {
        if (current->next->value == val) {
            Node* toDelete = current->next;
            current->next = current->next->next;
            delete toDelete;
            return;
        }
        current = current->next;
    }
}
```

### Types of Linked Lists

There are several types of linked lists, each with its own advantages and disadvantages:

*   **Singly Linked List**: Each node only points to the next node in the list.
*   **Doubly Linked List**: Each node points both to the previous and next nodes in the list.
*   **Circular Linked List**: The last node points back to the first node, forming a circle.

### Exercises

1.  Create a singly linked list and perform operations like insertion, deletion, and traversal.
2.  Implement a doubly linked list and demonstrate its usage with examples.
3.  Construct a circular linked list and test its properties.
4.  Write a function to find the middle element of a linked list using a single pass through the list.
5.  Develop an algorithm to detect whether a given linked list is empty or contains at least one node.

### Example Code

Here's some sample code for each type of linked list:
```cpp
// SinglyLinkedList.cpp
#include "Node.h"

void singlyLinkedListExample() {
    LinkedList* myList = new LinkedList();

    // Insert elements into the list
    myList->insert(10);
    myList->insert(20);
    myList->insert(30);

    // Delete an element from the list
    myList->deleteValue(20);

    // Print the updated list
    Node* current = myList->head;

    while (current != nullptr) {
        std::cout << current->value << " ";
        current = current->next;
    }

    delete myList;
}
```

```cpp
// DoublyLinkedList.cpp
#include "Node.h"

void doublyLinkedListExample() {
    LinkedList* myList = new LinkedList();

    // Insert elements into the list
    myList->insert(10);
    myList->insert(20);
    myList->insert(30);

    // Traverse the list in both directions
    Node* currentForward = myList->head;
    while (currentForward != nullptr) {
        std::cout << "Forward: " << currentForward->value << " ";
        currentForward = currentForward->next;
    }

    Node* currentBackward = myList->head;
    while (currentBackward != nullptr) {
        std::cout << "Backward: " << currentBackward->value << " ";
        currentBackward = currentBackward->prev;
    }

    delete myList;
}
```
