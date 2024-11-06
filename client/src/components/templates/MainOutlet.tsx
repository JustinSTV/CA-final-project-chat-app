import { Outlet } from "react-router-dom";
import styled from "styled-components";
import Header from "../UI/organism/Header";

const StyledMain = styled.main`
  height: 100vh;
  display: flex;
  position: relative;
  margin-left: 60px;

  @media (min-width: 700px) {
    margin-left: 70px;
  }
`
const MainOutlet = () => {
  return (
    <>
      <StyledMain>
        <Header />
        <Outlet />
      </StyledMain>
    </>
  );
}
 
export default MainOutlet;