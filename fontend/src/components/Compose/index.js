import React from 'react';
import './Compose.css';
import { useForm } from 'react-hook-form';
import Picker, { SKIN_TONE_MEDIUM_DARK } from 'emoji-picker-react';
import { useSelector } from 'react-redux';

export default function Compose(props) {
  const { sendMessage, sendTyping, endTyping } = props;
  const { handleSubmit, register } = useForm();
  const [openEmoji, setOpenEmoji] = React.useState(false);
  const { roomActive } = useSelector(state => state.RoomReducer);
  // React.useEffect(() => {
  //   window.onclick = e => {
  //     const element = e.target;
  //     console.log(element.classList[0] === 'emoji-picker');
  //     setOpenEmoji(() => element.classList[0] === 'emoji-picker');
  //   };

  //   return () => (window.onclick = {});
  // }, []);
  React.useEffect(() => {
    const inputElement = document.getElementById('message_input');
    inputElement.value = '';
    setOpenEmoji(() => false);
  }, [roomActive]);
  const onSubmit = (data, e) => {
    console.log(data);
    sendMessage(data, () => {
      document.getElementById('message_input').blur();
    });

    e.target.reset();
  };
  const onEmojiClick = (even, emojiObject) => {
    console.log(emojiObject);
    const inputElement = document.getElementById('message_input');
    inputElement.value += emojiObject.emoji;
  };
  return (
    <div className="compose">
      {props.leftItem}
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          className="compose-input"
          placeholder="Type a message, @name"
          name="message"
          ref={register}
          onChange={event => sendTyping(event)}
          autoComplete="off"
          onBlur={endTyping}
          onFocus={() => setOpenEmoji(false)}
          id="message_input"
        />
        <div className="emoji-box">
          <i
            className="ion-md-happy emoji_icon"
            onClick={() => setOpenEmoji(!openEmoji)}
          ></i>
          <div className="emoji-picker">
            {openEmoji ? (
              <Picker
                onEmojiClick={onEmojiClick}
                disableAutoFocus={true}
                groupNames={{ smileys_people: 'PEOPLE' }}
                skinTone={SKIN_TONE_MEDIUM_DARK}
                className="emoji-picker"
                disableSearchBar={true}
              />
            ) : (
              ''
            )}
          </div>
        </div>
      </form>

      {props.rightItems}
    </div>
  );
}
