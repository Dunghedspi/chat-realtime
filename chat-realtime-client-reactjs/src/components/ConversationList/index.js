import React, { useState, useEffect } from 'react';
import ConversationSearch from '../ConversationSearch';
import ConversationListItem from '../ConversationListItem';
import Toolbar from '../Toolbar';
import ToolbarButton from '../ToolbarButton';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';

import './ConversationList.css';
import { UserAction } from '../../actions/user.action';

export default function ConversationList(props) {
  const { rooms } = useSelector(state => state.RoomReducer);
  const user = useSelector(state => state.UserReducer);
  const [toggleModal, setToggleModal] = React.useState(false);
  const [changepass, setChangepass] = React.useState(false);
  const methods1 = useForm();
  const methods2 = useForm();
  const dispatch = useDispatch();
  const { handleSubmit, register } = methods1;

  const handleSubmitAvatar = methods2.handleSubmit;
  const registerAvatar = methods2.register;

  const onsubmitAvatar = data => {
    const formData = new FormData();
    formData.append('avatar', data.avatar[0]);
    dispatch(UserAction.changeAvatar(formData));
  };
  const onSubmitInfo = data => {
    dispatch(UserAction.changePassword(data));
  };

  const openModal = () => {
    setToggleModal(true);
  };
  return (
    <>
      <div className="conversation-list">
        <Toolbar
          title="Messenger"
          leftItems={[
            <ToolbarButton key="cog" icon="ion-ios-cog" onClick={openModal} />,
          ]}
          rightItems={[
            <ToolbarButton key="cog" icon="ion-ios-cog" onClick={openModal} />,
          ]}
        />
        <ConversationSearch {...props} />
        {rooms.map((room, index) => (
          <ConversationListItem key={index} room={room} />
        ))}
      </div>
      {toggleModal ? (
        <div className="Modal-Background">
          <span className="close" onClick={() => setToggleModal(false)}>
            &times;
          </span>
          <div class="Center-Content">
            <form className="form-avatar" name="form-avatar">
              <label htmlFor="avatar">
                <img src={user.avatar} className="avatar-user" />
              </label>
              <input
                type="file"
                name="avatar"
                ref={registerAvatar}
                hidden
                id="avatar"
                onChange={handleSubmitAvatar(onsubmitAvatar)}
              />
            </form>
            <form
              className="info"
              onSubmit={handleSubmit(onSubmitInfo)}
              name="form-info"
            >
              <div className="input-group">
                <label htmlFor="email-user">Email</label>
                <input disabled value={user.email} id="email-user" />
              </div>
              {changepass ? (
                <>
                  <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoFocus={true}
                      ref={register}
                    />
                  </div>
                  <div className="input-group">
                    <label htmlFor="new-password">New Password</label>
                    <input
                      id="new-password"
                      name="newPassword"
                      type="password"
                      ref={register}
                    />
                  </div>
                </>
              ) : (
                ''
              )}
              {!changepass ? (
                <button
                  className="change-pass"
                  type="button"
                  onClick={() => setChangepass(true)}
                >
                  Change Password
                </button>
              ) : (
                <div className="button-group">
                  <button type="submit">Submit</button>
                </div>
              )}
            </form>
          </div>
        </div>
      ) : (
        ''
      )}
    </>
  );
}
