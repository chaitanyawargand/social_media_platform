const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const AppError= require('./utils/apperror')
const globalErrorHandler=require('./controllers/errorHandler')
const app = express();
const userroutes= require('./routes/userroutes');

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());

// Data sanitization
app.use(mongoSanitize());
app.use(xss());

// routes
app.use('/',userroutes);
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;