import styled from 'styled-components';

export const OrganismsMain = styled.main`
  margin-left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) => (props.full ? '#16202c' : 'black')};

  @media screen and (max-width: 936px) {
    margin-left: 0;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    z-index: inherit;
  }
`;
