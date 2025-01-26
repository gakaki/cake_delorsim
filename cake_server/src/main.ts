declare const module: any;

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {

	console.log('current env is:',process.env.NODE_ENV)

	const app = await NestFactory.create(AppModule);
	await app.listen(3000);
	
	if (process.env.NODE_ENV == 'development') {
		console.log('hot reload enabled');
		if (module.hot ){
			module.hot.accept();
			module.hot.dispose(() => app.close());
		}
	}
}
bootstrap();
