/* =========================================================
   Footer — 页脚
   ========================================================= */

function Footer() {
  return (
    <footer className="footer" data-screen-label="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <h3>敦煌画窟 Dunhuang Vault</h3>
            <p>
              以数字化方式留存千年壁画之美，让每一位观者都能走入洞窟深处，
              与那些被时光封存的色彩和故事，重新相遇。
            </p>
          </div>
          <div className="footer-col">
            <h4>观览</h4>
            <ul>
              <li><a href="#caves">洞窟展厅</a></li>
              <li><a href="#stories">壁画故事</a></li>
              <li><a href="#pigments">矿物颜料</a></li>
              <li><a href="#altar">数字档案</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>关于</h4>
            <ul>
              <li><a href="#caisson">项目缘起</a></li>
              <li><a href="#">学术团队</a></li>
              <li><a href="#">合作伙伴</a></li>
              <li><a href="#">联系方式</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>关注</h4>
            <ul>
              <li><a href="#">微信公众号</a></li>
              <li><a href="#">微博</a></li>
              <li><a href="#">小红书</a></li>
              <li><a href="#">邮件订阅</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 敦煌画窟 Dunhuang Vault · 数字文化遗产项目</span>
          <span>谨以此致敬千年画师与守护者</span>
        </div>
      </div>
    </footer>
  );
}

window.Footer = Footer;
