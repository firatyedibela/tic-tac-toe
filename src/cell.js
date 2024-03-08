const Cell = function() {
  let value = null;

  const getValue = () => value;

  const changeValue = (token) => value = token;
  
  return { getValue, changeValue }
}

export default Cell;