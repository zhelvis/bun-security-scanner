import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  input: 'https://osv.dev/docs/osv_service_v1.swagger.json',
  output: 'src/client',
  plugins: [
    'valibot',
    {
      name: '@hey-api/sdk', 
      validator: true, 
    },
  ]
});