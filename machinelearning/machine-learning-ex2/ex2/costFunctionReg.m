function [J, grad] = costFunctionReg(theta, X, y, lambda)
%COSTFUNCTIONREG Compute cost and gradient for logistic regression with regularization
%   J = COSTFUNCTIONREG(theta, X, y, lambda) computes the cost of using
%   theta as the parameter for regularized logistic regression and the
%   gradient of the cost w.r.t. to the parameters. 

% Initialize some useful values
m = length(y); % number of training examples

% You need to return the following variables correctly 
J = 0;
grad = zeros(size(theta));

% ====================== YOUR CODE HERE ======================
% Instructions: Compute the cost of a particular choice of theta.
%               You should set J to the cost.
%               Compute the partial derivatives and set grad to the partial
%               derivatives of the cost w.r.t. each parameter in theta

nHypothesis = X * theta;
hypothesis  = sigmoid(nHypothesis);

derivativePart = diag(hypothesis - y) * X;
thetaMod = theta;
thetaMod(1) = 0;
term2 = (lambda / m) .* thetaMod';
term1 = (1 / m) * sum(derivativePart);
grad  = term1 + term2;

costMatrix1 = -1 .* y .* log(hypothesis);
costMatrix2 = (1 - y) .* log (1 - hypothesis);
costMatrix  = costMatrix1 - costMatrix2;

thetaSquares = theta .* theta;
thetaSquares(1) = 0;

J = ( 1 / m ) * sum( costMatrix ) + lambda / (2 * m) * sum(thetaSquares);




% =============================================================

end
