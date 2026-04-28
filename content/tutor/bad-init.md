# Tutor Mode: Bad Init

## Concept

Initialization paths should not remain publicly callable after deployment.

## Direction

Focus on the function that creates an admin capability for an already claimed instance.

## Checklist

- Can init run more than once?
- Can a normal user create admin state?
- Is the admin cap checked later?

