import "@nivinjoseph/n-ext";
import { WebApp } from "@nivinjoseph/n-web";
import { ConfigurationManager } from "@nivinjoseph/n-config";
import { ConsoleLogger, LogDateTimeZone } from "@nivinjoseph/n-log";
import { ComponentInstaller, Registry } from "@nivinjoseph/n-ject";
import { given } from "@nivinjoseph/n-defensive";
import { controllers as appControllers } from "./app/controllers";


const logger = new ConsoleLogger(LogDateTimeZone.est);

class Installer implements ComponentInstaller
{
    public install(registry: Registry): void
    {
        given(registry, "registry").ensureHasValue().ensureIsObject();

        registry
            .registerInstance("Logger", logger);
    }
}

const server = new WebApp(Number.parseInt(ConfigurationManager.getConfig<number>("PORT") as any), null);
server
    .enableWebPackDevMiddleware()
    .useLogger(logger)
    .useInstaller(new Installer())
    .registerStaticFilePath("src/client/dist", true)
    .registerControllers(...appControllers)
    ;

if (ConfigurationManager.getConfig("env") === "prod")
    server.registerStaticFilePath("src/server/public");

server.bootstrap();