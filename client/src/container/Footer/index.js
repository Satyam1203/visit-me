import React from "react";
import styled from "styled-components";

const FooterDiv = styled.div`
  width: 100%;
  min-height: 40px;
  background: #333;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  // position: sticky;
  // bottom: 0;
`;

export default function Footer() {
  return <FooterDiv>All rights reserved. © visit-me</FooterDiv>;
}
