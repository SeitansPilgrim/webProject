const MIN_QUESTION_LENGTH = 1;
const MIN_ANSWER_LENGTH = 1;
const MIN_TITLE_LENGTH = 1;
const MIN_ARTICLE_LENGTH = 1;
const MIN_NAME_LENGTH = 1;
const MIN_DESC_LENGTH = 1;

const MIN_ID_LENGTH = 1; 

exports.getFaqValidationErrors = function(question, answer) {
	const validationErrors = []

	if (question.length < MIN_QUESTION_LENGTH) {
		validationErrors.push("Question must be at least " + MIN_QUESTION_LENGTH + " characters")
	}

	if (answer.length < MIN_ANSWER_LENGTH) {
		validationErrors.push("Answer must be at least " + MIN_ANSWER_LENGTH + " characters")
	}
	return validationErrors
}

exports.getArticleValidationErrors = function(title, article) {
	const validationErrors = []

	if (title.length < MIN_TITLE_LENGTH) {
		validationErrors.push("Title must be at least " + MIN_TITLE_LENGTH + " characters")
	}

	if (article.length < MIN_ARTICLE_LENGTH) {
		validationErrors.push("Article must be at least " + MIN_ARTICLE_LENGTH + " characters")
	}
	return validationErrors
}

exports.getRecipeValidationErrors = function(name, desc) {
	const validationErrors = []

	if (name.length < MIN_NAME_LENGTH) {
		validationErrors.push("Name must be at least " + MIN_NAME_LENGTH + " characters")
	}

	if (desc.length < MIN_DESC_LENGTH) {
		validationErrors.push("Description must be at least " + MIN_DESC_LENGTH + " characters")
	}
	return validationErrors
}

exports.getFaqIdValidationErrors = function(faqID){
	
	const validationErrors = []

	if(faqID.length < MIN_ID_LENGTH){
		validationErrors.push("Id must be at least " + MIN_ID_LENGTH + "characters")
	}
	return validationErrors
}