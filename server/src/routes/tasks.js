"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const express_1 = require("express");
const router = (0, express_1.Router)();
aws_sdk_1.default.config.update({ region: 'eu-north-1' }); // CHANGE TO YOUR SERVER LOCATION
const dynamoDB = new aws_sdk_1.default.DynamoDB.DocumentClient();
const TABLE_NAME = 'TMS-Table'; // CHANGE THIS TO YOUR TABLE NAME 
router.post('/tasks', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, status } = req.body;
    const params = {
        TableName: TABLE_NAME,
        Item: {
            TaskID: `${Date.now()}`,
            title,
            status,
        },
    };
    try {
        yield dynamoDB.put(params).promise();
        res.status(201).json(params.Item);
    }
    catch (error) {
        console.error("Error creating task:", error);
        res.status(500).json({ error: 'Could not create task' });
    }
}));
router.get('/tasks', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const params = {
        TableName: TABLE_NAME,
    };
    try {
        const data = yield dynamoDB.scan(params).promise();
        res.json(data.Items || []);
    }
    catch (error) {
        console.error("Error retrieving tasks:", error);
        res.status(500).json({ error: 'Could not retrieve tasks' });
    }
}));
router.put('/tasks/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { title, status } = req.body;
    if (title === undefined && status === undefined) {
        return res.status(400).json({ error: 'At least one attribute (title or status) is required to update' });
    }
    const updateExpressions = [];
    const expressionAttributeValues = {};
    const expressionAttributeNames = {};
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
        const result = yield dynamoDB.update(params).promise();
        res.json(result.Attributes);
    }
    catch (error) {
        console.error("Error updating task:", error);
        res.status(500).json({ error: 'Could not update task' });
    }
}));
router.delete('/tasks/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const params = {
        TableName: TABLE_NAME,
        Key: { TaskID: id },
    };
    try {
        yield dynamoDB.delete(params).promise();
        res.status(204).send();
    }
    catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({ error: 'Could not delete task' });
    }
}));
exports.default = router;
