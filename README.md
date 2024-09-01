// db.js

/*
Database Table Structure for Taskie Project

1. Users Table
   - id (Primary Key)
   - username (Unique)
   - email (Unique)
   - password_hash
   - full_name
   - role (e.g., admin, manager, employee)
   - created_at
   - updated_at

2. Permissions Table
   - id (Primary Key)
   - name (e.g., create_task, edit_task, view_task, etc.)
   - description

3. User_Permissions Table (Many-to-Many relationship between Users and Permissions)
   - id (Primary Key)
   - user_id (Foreign Key referencing Users table)
   - permission_id (Foreign Key referencing Permissions table)

4. Tasks Table
   - id (Primary Key)
   - title
   - description
   - status (e.g., not started, in progress, completed)
   - priority
   - due_date
   - created_by (Foreign Key referencing Users table)
   - assigned_to (Foreign Key referencing Users table)
   - created_at
   - updated_at

5. Task_Comments Table
   - id (Primary Key)
   - task_id (Foreign Key referencing Tasks table)
   - user_id (Foreign Key referencing Users table)
   - comment_text
   - created_at

6. Task_Attachments Table
   - id (Primary Key)
   - task_id (Foreign Key referencing Tasks table)
   - user_id (Foreign Key referencing Users table)
   - file_name
   - file_path
   - file_type
   - uploaded_at

7. Locations Table
   - id (Primary Key)
   - name
   - address
   - capacity
   - created_by (Foreign Key referencing Users table)
   - created_at
   - updated_at

8. Task_Locations Table (Many-to-Many relationship between Tasks and Locations)
   - id (Primary Key)
   - task_id (Foreign Key referencing Tasks table)
   - location_id (Foreign Key referencing Locations table)

Permissions to consider:
- create_task
- edit_task
- view_task
- delete_task
- assign_task
- add_task_comment
- view_task_comments
- upload_task_attachment
- download_task_attachment
- create_location
- edit_location
- view_location
- delete_location
- assign_user_permissions (admin only)

Admin functionality:
- Admins should have all permissions by default
- Admins can assign/revoke permissions to/from users
- Admins can create new permissions
- Admins can view audit logs of user actions

Additional considerations:
- Implement soft delete for tasks and locations (add a 'deleted_at' column)
- Add indexes on frequently queried columns for performance
- Consider adding a 'last_login' column to the Users table for tracking user activity
- Implement proper password hashing and salting for user security
- Use database transactions for operations that involve multiple tables
- Set up foreign key constraints with appropriate ON DELETE and ON UPDATE actions
*/