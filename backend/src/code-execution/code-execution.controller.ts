import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { Public } from 'src/auth/decorators/public.decorators';

@Controller('code-execution')
export class CodeExecutionController {
  @Public()
  @Post()
  async executeCode(@Body() body: { language: string; code: string }) {
    const { language, code } = body;

    if (!language || !code) {
      throw new HttpException('Language and code are required', HttpStatus.BAD_REQUEST);
    }

    try {
      const { data } = await axios.post('https://emkc.org/api/v2/piston/execute', {
        language,
        version: '*',
        files: [{ content: code }],
      });

      const output = data.run?.stdout?.trim() || '';
      const error = data.run?.stderr?.trim() || '';
      const finalOutput =
        output || error || '✅ Executed successfully (no output)';

      return { output: finalOutput };
    } catch (err) {
      console.error('❌ Code execution failed:', err?.response?.data || err.message);
      throw new HttpException('Error executing code', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
