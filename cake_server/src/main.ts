declare const module: any;
import compression from '@fastify/compress';
import { constants } from 'zlib';
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import {
	FastifyAdapter,
	NestFastifyApplication,
  } from '@nestjs/platform-fastify';
  
async function bootstrap() {

	console.log('env is:',process.env.NODE_ENV)

	const app = await NestFactory.create<NestFastifyApplication>(
		AppModule,
		new FastifyAdapter({ logger: true })
	);
	await app.register(compression, { brotliOptions: { params: { [constants.BROTLI_PARAM_QUALITY]: 4 } } });
	await app.listen(15001, '0.0.0.0');

	if (process.env.NODE_ENV == 'development') {
		console.log('hot reload enabled');
		if (module.hot ){
			module.hot.accept();
			module.hot.dispose(() => app.close());
		}
	}
}
bootstrap();
