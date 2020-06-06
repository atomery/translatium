import { START_TEXT_TO_SPEECH, END_TEXT_TO_SPEECH } from '../../../../constants/actions';

export const startTextToSpeech = (textToSpeechLang, textToSpeechText) => ((dispatch) => {
  if (textToSpeechText.length < 1) return;

  const voices = window.speechSynthesis.getVoices();

  let voice;
  for (let i = 0; i < voices.length; i += 1) {
    if (voices[i].lang.startsWith(textToSpeechLang)) {
      voice = voices[i];
      break;
    }
  }

  dispatch({ type: START_TEXT_TO_SPEECH, textToSpeechLang, textToSpeechText });

  const utterThis = new window.SpeechSynthesisUtterance(textToSpeechText);
  utterThis.voice = voice;
  utterThis.onend = () => {
    dispatch({ type: END_TEXT_TO_SPEECH });
  };

  window.speechSynthesis.speak(utterThis);

  dispatch({ type: START_TEXT_TO_SPEECH });
});

export const endTextToSpeech = () => ((dispatch) => {
  window.speechSynthesis.cancel();
  dispatch({ type: END_TEXT_TO_SPEECH });
});
