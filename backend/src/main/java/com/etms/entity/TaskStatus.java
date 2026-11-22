package com.etms.entity;

/**
 * Allowed values for a task's status column.
 * Stored in the database as the enum name string (TODO, IN_PROGRESS, DONE).
 */
public enum TaskStatus {
    TODO,
    IN_PROGRESS,
    DONE
}
