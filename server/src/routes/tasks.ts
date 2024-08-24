import AWS from 'aws-sdk';
import { Router, Request, Response } from 'express';

const router = Router();

// Configure AWS SDK
AWS.config.update({ region: 'eu-north-1' }); // Replace with your region
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'TMS-Table';

// Create a task
// Create a task
router.post('/tasks', async (req: Request, res: Response) => {
    const { title, status } = req.body;
    const params = {
        TableName: TABLE_NAME,
        Item: {
            TaskID: `${Date.now()}`, // Unique ID
            title,
            status,
        },
    };

    try {
        await dynamoDB.put(params).promise();
        res.status(201).json(params.Item);
    } catch (error: unknown) {
        console.error("Error creating task:", error);
        res.status(500).json({ error: 'Could not create task' });
    }
});

// Get all tasks
router.get('/tasks', async (req: Request, res: Response) => {
    const params = {
        TableName: TABLE_NAME,
    };

    try {
        const data = await dynamoDB.scan(params).promise();
        res.json(data.Items || []); // Handle case where Items might be undefined
    } catch (error: unknown) {
        console.error("Error retrieving tasks:", error);
        res.status(500).json({ error: 'Could not retrieve tasks' });
    }
});

// Update a task
router.put('/tasks/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, status } = req.body;

    // Ensure at least one attribute is provided
    if (title === undefined && status === undefined) {
        return res.status(400).json({ error: 'At least one attribute (title or status) is required to update' });
    }

    // Prepare UpdateExpression and ExpressionAttributeValues
    const updateExpressions: string[] = [];
    const expressionAttributeValues: { [key: string]: any } = {};
    const expressionAttributeNames: { [key: string]: string } = {};

    if (title !== undefined) {
        updateExpressions.push('#title = :title');
        expressionAttributeValues[':title'] = title;
        expressionAttributeNames['#title'] = 'title';
    }

    if (status !== undefined) {
        updateExpressions.push('#status = :status');
        expressionAttributeValues[':status'] = status;
        expressionAttributeNames['#status'] = 'status';
    }

    // Construct the UpdateExpression string
    const updateExpression = `SET ${updateExpressions.join(', ')}`;

    const params = {
        TableName: TABLE_NAME,
        Key: { TaskID: id },
        UpdateExpression: updateExpression,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'UPDATED_NEW',
    };

    try {
        const result = await dynamoDB.update(params).promise();
        res.json(result.Attributes);
    } catch (error) {
        console.error("Error updating task:", error);
        res.status(500).json({ error: 'Could not update task' });
    }
});




router.delete('/tasks/:id', async (req: Request, res: Response) => {
    const { id } = req.params;

    const params = {
        TableName: TABLE_NAME,
        Key: { TaskID: id },
    };

    try {
        await dynamoDB.delete(params).promise();
        res.status(204).send();
    } catch (error) {
        console.error("Error deleting task:", error); // Log the error
        res.status(500).json({ error: 'Could not delete task' });
    }
});

export default router;