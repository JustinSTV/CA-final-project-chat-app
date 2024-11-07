import { Outlet } from "react-router-dom";
import { useState } from "react";
import styled from "styled-components";
import Header from "../UI/organism/Header";

const StyledMain = styled.main`
  height: 100vh;
`
const GridLayout = styled.div<{ isExpanded: boolean }>`
  display: grid;
  grid-template-columns: ${({ isExpanded }) => (isExpanded ? '25% 1fr' : '100px 1fr')};
  transition: grid-template-columns 0.3s ease;
`;
const MainOutlet = () => {

  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <GridLayout isExpanded={isExpanded}>
      <Header  isExpanded={isExpanded} setIsExpanded={setIsExpanded}/>
      <StyledMain>
        <Outlet />
      </StyledMain>
    </GridLayout>
  );
}
 
export default MainOutlet;