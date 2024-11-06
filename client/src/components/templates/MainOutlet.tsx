import { Outlet } from "react-router-dom";
import { useState } from "react";
import styled from "styled-components";
import Header from "../UI/organism/Header";

const StyledMain = styled.main<{ isExpanded: boolean }>`
  height: 100vh;
  display: flex;
  position: relative;
  padding-left: 100px;
  transition: padding-left 0.3s ease;

  @media (min-width: 481px) and (max-width: 767px) {
    padding-left: 100px;
  }
`
const MainOutlet = () => {

  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <Header  isExpanded={isExpanded} setIsExpanded={setIsExpanded}/>
      <StyledMain isExpanded={isExpanded}>
        <Outlet />
      </StyledMain>
    </>
  );
}
 
export default MainOutlet;