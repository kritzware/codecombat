import Level from "@/levels/types";

import _l from "@/levels/level-1";

const ctx: Worker = self as any;

(<any>ctx)._callPostMessage = (type: string, data?: any) => {
  if (!type) {
    return;
  }
  ctx.postMessage({ type, data });
};

async function execute(l?: Level) {
  if (!_l.code) return;

  // TODO: Make this better (currently it just adds the level vars to this)
  const levelVars: object = _l.init();
  Object.keys(levelVars).forEach(v => ((<any>ctx)[v] = (<any>levelVars)[v]));

  try {
    eval(_l.code);
    (<any>ctx)._callPostMessage("sandbox:finished");
  } catch (error) {
    (<any>ctx)._callPostMessage("sandbox:error", { error });
  }
}

ctx.addEventListener("message", event => execute(event.data));
