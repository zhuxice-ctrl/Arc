/* =========================================================
   Caisson — 藻井装饰区
   多层反向旋转 + 引言
   ========================================================= */

const CAISSON_IMG = '/spark/app/app_17c7ssvjn08/runtime/api/v1/storage/object/bucket_aadkqgfafgseo_static/static%2Faadkqfzvyd4qs_ve_miaoda';

function Caisson() {
  return (
    <section className="caisson" id="caisson" data-screen-label="caisson">
      <div className="caisson-wheel layer-1" aria-hidden="true">
        <img src={CAISSON_IMG} alt="" />
      </div>
      <div className="caisson-wheel layer-2" aria-hidden="true">
        <img src={CAISSON_IMG} alt="" />
      </div>
      <div className="caisson-wheel layer-3" aria-hidden="true">
        <img src={CAISSON_IMG} alt="" />
      </div>
      <div className="caisson-text reveal">
        <p className="quote">
          「敦煌者，吾国学术之伤心史也。」
        </p>
        <p className="cite">—— 陈寅恪 · 1930</p>
      </div>
    </section>
  );
}

window.Caisson = Caisson;
