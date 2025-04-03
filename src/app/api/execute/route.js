import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import os from 'os';

// Maximum execution time (in milliseconds)
const EXECUTION_TIMEOUT = 10000; // 10 seconds

// Maximum output size (in characters)
const MAX_OUTPUT_SIZE = 50000;

export async function POST(request) {
  try {
    const { code } = await request.json();
    
    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { error: 'Invalid code provided' },
        { status: 400 }
      );
    }
    
    // Generate a unique filename to prevent collisions
    const uniqueId = uuidv4();
    const tempDir = os.tmpdir();
    const tempFilePath = path.join(tempDir, `python_code_${uniqueId}.py`);
    
    // Write the code to a temporary file
    await writeFile(tempFilePath, code);
    
    // Execute the Python code
    const result = await executePythonCode(tempFilePath);
    
    // Clean up - remove the temporary file
    try {
      await unlink(tempFilePath);
    } catch (cleanupError) {
      console.error('Error cleaning up temp file:', cleanupError);
    }
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Error executing Python code:', error);
    return NextResponse.json(
      { error: 'Server error while executing code' },
      { status: 500 }
    );
  }
}

// Function to execute Python code
async function executePythonCode(filePath) {
  return new Promise((resolve) => {
    let output = '';
    let error = '';

    // Specify the Python 3.12 executable
    const pythonExecutable = 'python'; // Adjust to your Python version

    // Execute the Python script
    const process = exec(`${pythonExecutable} ${filePath}`, {
      timeout: EXECUTION_TIMEOUT,
      maxBuffer: MAX_OUTPUT_SIZE,
    });

    // Collect stdout
    process.stdout.on('data', (data) => {
      output += data.toString();

      // Limit output size to prevent overflows
      if (output.length > MAX_OUTPUT_SIZE) {
        process.kill();
        error = 'Output exceeded maximum size limit.';
      }
    });

    // Collect stderr
    process.stderr.on('data', (data) => {
      error += data.toString();
      error = error.replace("C:\\Users\\devma\\AppData\\Local\\Temp\\", ""); // Remove temp path from error message
    });

    // Handle process completion
    process.on('close', (code) => {
      resolve({
        output: output.substring(0, MAX_OUTPUT_SIZE),
        error: error || null,
        exitCode: code,
      });
    });

    // Handle process errors
    process.on('error', (err) => {
      resolve({
        output,
        error: `Execution error: ${err.message}`,
        exitCode: 1,
      });
    });
  });
}