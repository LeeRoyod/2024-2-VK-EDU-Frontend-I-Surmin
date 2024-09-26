/*
For the input of your function, you will be given one sentence.
You have to return a corrected version,
that starts with a capital letter and ends with a period (dot).

Example:

input (string): "hey, friend"
output (string): "Hey, friend."

Updated first 'h' to 'H', added '.'.

More examples:

correctSentence("greetings, friends") == "Greetings, friends."
correctSentence("Greetings, friends") == "Greetings, friends."
correctSentence("Greetings, friends.") == "Greetings, friends."
 */

export default function correctSentence(text) {
  if (typeof text !== 'string') {
    return false;
  }

  text = text.trim();

  if (text.length === 0) {
    return '';
  }

  text = text.charAt(0).toUpperCase() + text.slice(1);

  if (!text.endsWith('.')) {
    text += '.';
  }

  return text;
}
