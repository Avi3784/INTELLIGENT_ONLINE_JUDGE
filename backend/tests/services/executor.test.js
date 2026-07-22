const { executeCode } = require('../../services/executor');

describe('Code Execution Engine', () => {
  
  const testCases = [
    { input: '2\n3', expectedOutput: '5', isHidden: false }
  ];

  it('should correctly execute valid javascript code and return AC', async () => {
    const code = `
      const fs = require('fs');
      const input = fs.readFileSync(0, 'utf-8').trim().split('\\n');
      console.log(parseInt(input[0]) + parseInt(input[1]));
    `;
    
    const results = await executeCode(code, 'javascript', testCases, 2000, null, null);
    
    expect(results).toHaveLength(1);
    expect(results[0].passed).toBe(true);
    expect(results[0].actualOutput).toBe('5');
    expect(results[0].error).toBeUndefined();
  });

  it('should return WA (Wrong Answer) if output does not match', async () => {
    const code = `
      console.log('10');
    `;
    
    const results = await executeCode(code, 'javascript', testCases, 2000, null, null);
    
    expect(results[0].passed).toBe(false);
    expect(results[0].actualOutput).toBe('10');
  });

  it('should return RTE (Runtime Error) if code throws exception', async () => {
    const code = `
      throw new Error('Something broke');
    `;
    
    const results = await executeCode(code, 'javascript', testCases, 2000, null, null);
    
    expect(results[0].passed).toBe(false);
    expect(results[0].error).toBeDefined();
    expect(results[0].error).toMatch(/RTE/);
  });

});
