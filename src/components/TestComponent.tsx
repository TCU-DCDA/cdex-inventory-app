const TestComponent = () => {
  console.log('TestComponent is rendering');
  
  return (
    <div style={{ backgroundColor: 'red', color: 'white', padding: '20px', fontSize: '24px' }}>
      <h1>TEST COMPONENT IS WORKING</h1>
      <p>If you can see this, React is working fine.</p>
    </div>
  );
};

export default TestComponent;
