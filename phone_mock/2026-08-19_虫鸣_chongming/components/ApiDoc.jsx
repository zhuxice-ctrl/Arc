// 接口文档页

function ApiDoc({ onBack }) {
  return (
    <div className="screen screen-push">
      <NavBar title="接口文档" showBack onBack={onBack} />
      <div className="content-wrap no-tab">
        <div className="doc-screen">
          <h1 className="doc-h1">虫鸣 · 接口文档</h1>
          <p className="doc-subtitle">
            形态：原生 App。后端 RESTful API 说明，
            用于鸣虫识别、虫谱管理、手账记录等功能。
          </p>

          <h2 className="doc-h2">概述</h2>
          <p className="doc-p">
            基础路径：<code style={{
              background: 'var(--night-700)',
              padding: '2px 6px',
              borderRadius: '4px',
              fontFamily: 'SF Mono, monospace',
              fontSize: '12px',
              color: 'var(--bamboo-300)'
            }}>https://api.bugcall.app/v1</code>
          </p>
          <p className="doc-p">
            所有请求需携带 <code style={{
              background: 'var(--night-700)',
              padding: '2px 6px',
              borderRadius: '4px',
              fontFamily: 'SF Mono, monospace',
              fontSize: '12px',
              color: 'var(--bamboo-300)'
            }}>Authorization: Bearer {`<token>`}</code>
          </p>
          <p className="doc-p">
            返回格式：JSON。统一响应结构：
          </p>
          <div className="doc-code">{`{
  <span class="key">"code"</span>: <span class="num">0</span>,          <span class="com">// 0 成功，非 0 错误</span>
  <span class="key">"message"</span>: <span class="str">"ok"</span>,
  <span class="key">"data"</span>: { }            <span class="com">// 业务数据</span>
}`}</div>

          <h2 className="doc-h2">鸣虫识别</h2>

          <div className="endpoint-block">
            <div className="endpoint-header">
              <span className="method-badge method-post">POST</span>
              <span className="endpoint-path">/recognize</span>
            </div>
            <p className="doc-p">上传一段虫鸣音频，返回识别结果列表，按相似度排序。</p>

            <h3>请求 Body (multipart/form-data)</h3>
            <table className="doc-table">
              <thead>
                <tr>
                  <th>字段</th>
                  <th>类型</th>
                  <th>说明</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>audio</td>
                  <td>file</td>
                  <td>音频文件，支持 wav / m4a / mp3</td>
                </tr>
                <tr>
                  <td>duration</td>
                  <td>number</td>
                  <td>录音时长（秒）</td>
                </tr>
                <tr>
                  <td>latitude</td>
                  <td>number?</td>
                  <td>纬度，辅助地域判断</td>
                </tr>
                <tr>
                  <td>longitude</td>
                  <td>number?</td>
                  <td>经度</td>
                </tr>
              </tbody>
            </table>

            <h3>响应 data</h3>
            <div className="doc-code">{`{
  <span class="key">"results"</span>: [
    {
      <span class="key">"insectId"</span>: <span class="str">"cricket"</span>,
      <span class="key">"name"</span>: <span class="str">"蟋蟀"</span>,
      <span class="key">"sciName"</span>: <span class="str">"Gryllus chinensis"</span>,
      <span class="key">"image"</span>: <span class="str">"..."</span>,
      <span class="key">"similarity"</span>: <span class="num">92</span>,
      <span class="key">"soundFeature"</span>: <span class="str">"..."</span>,
      <span class="key">"isNew"</span>: <span class="com">true</span> <span class="com">// 用户首次识别此虫</span>
    },
    <span class="com">// 更多候选...</span>
  ],
  <span class="key">"recordId"</span>: <span class="str">"rec_xxx"</span>
}`}</div>
          </div>

          <h2 className="doc-h2">虫谱管理</h2>

          <div className="endpoint-block">
            <div className="endpoint-header">
              <span className="method-badge method-get">GET</span>
              <span className="endpoint-path">/collection</span>
            </div>
            <p className="doc-p">获取用户已收集的虫谱列表。</p>
            <h3>响应 data</h3>
            <div className="doc-code">{`{
  <span class="key">"total"</span>: <span class="num">6</span>,
  <span class="key">"collected"</span>: <span class="num">3</span>,
  <span class="key">"items"</span>: [
    {
      <span class="key">"insectId"</span>: <span class="str">"cricket"</span>,
      <span class="key">"name"</span>: <span class="str">"蟋蟀"</span>,
      <span class="key">"collectedAt"</span>: <span class="str">"2025-08-15T22:30:00Z"</span>,
      <span class="key">"firstRecordId"</span>: <span class="str">"rec_xxx"</span>
    }
  ]
}`}</div>
          </div>

          <div className="endpoint-block">
            <div className="endpoint-header">
              <span className="method-badge method-post">POST</span>
              <span className="endpoint-path">/collection/{'{insectId}'}</span>
            </div>
            <p className="doc-p">将鸣虫加入虫谱。已存在则返回成功不重复添加。</p>
            <h3>响应 data</h3>
            <div className="doc-code">{`{
  <span class="key">"added"</span>: <span class="com">true</span>,
  <span class="key">"insectId"</span>: <span class="str">"cricket"</span>
}`}</div>
          </div>

          <div className="endpoint-block">
            <div className="endpoint-header">
              <span className="method-badge method-get">GET</span>
              <span className="endpoint-path">/insects</span>
            </div>
            <p className="doc-p">获取全部鸣虫图鉴数据（含未发现，用于展示虫谱全量）。</p>
            <h3>Query 参数</h3>
            <table className="doc-table">
              <thead>
                <tr>
                  <th>参数</th>
                  <th>类型</th>
                  <th>说明</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>active</td>
                  <td>boolean?</td>
                  <td>仅返回当前时段活跃的鸣虫</td>
                </tr>
                <tr>
                  <td>hour</td>
                  <td>number?</td>
                  <td>指定小时判断活跃，默认当前时间</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="endpoint-block">
            <div className="endpoint-header">
              <span className="method-badge method-get">GET</span>
              <span className="endpoint-path">/insects/{'{id}'}</span>
            </div>
            <p className="doc-p">获取单只鸣虫的详细信息。</p>
            <h3>响应 data</h3>
            <div className="doc-code">{`{
  <span class="key">"id"</span>: <span class="str">"cricket"</span>,
  <span class="key">"name"</span>: <span class="str">"蟋蟀"</span>,
  <span class="key">"sciName"</span>: <span class="str">"Gryllus chinensis"</span>,
  <span class="key">"image"</span>: <span class="str">"..."</span>,
  <span class="key">"soundDesc"</span>: <span class="str">"..."</span>,
  <span class="key">"activeTime"</span>: <span class="str">"20:00 - 02:00"</span>,
  <span class="key">"habitat"</span>: <span class="str">"草地、石缝"</span>,
  <span class="key">"description"</span>: <span class="str">"..."</span>,
  <span class="key">"collected"</span>: <span class="com">false</span>
}`}</div>
          </div>

          <h2 className="doc-h2">夜晚手账</h2>

          <div className="endpoint-block">
            <div className="endpoint-header">
              <span className="method-badge method-get">GET</span>
              <span className="endpoint-path">/journal</span>
            </div>
            <p className="doc-p">获取用户的夜晚手账记录，按时间倒序。</p>
            <h3>Query 参数</h3>
            <table className="doc-table">
              <thead>
                <tr>
                  <th>参数</th>
                  <th>类型</th>
                  <th>说明</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>cursor</td>
                  <td>string?</td>
                  <td>分页游标</td>
                </tr>
                <tr>
                  <td>limit</td>
                  <td>number?</td>
                  <td>每页数量，默认 20</td>
                </tr>
              </tbody>
            </table>
            <h3>响应 data</h3>
            <div className="doc-code">{`{
  <span class="key">"items"</span>: [
    {
      <span class="key">"id"</span>: <span class="str">"jrn_xxx"</span>,
      <span class="key">"insectId"</span>: <span class="str">"cricket"</span>,
      <span class="key">"similarity"</span>: <span class="num">92</span>,
      <span class="key">"timestamp"</span>: <span class="str">"2025-08-15T22:30:00Z"</span>,
      <span class="key">"location"</span>: {<span class="key">"lat"</span>: <span class="num">31.2</span>, <span class="key">"lng"</span>: <span class="num">121.5</span>}
    }
  ],
  <span class="key">"nextCursor"</span>: <span class="str">"..."</span>
}`}</div>
          </div>

          <div className="endpoint-block">
            <div className="endpoint-header">
              <span className="method-badge method-post">POST</span>
              <span className="endpoint-path">/journal</span>
            </div>
            <p className="doc-p">新增一条手账记录（识别成功后自动调用）。</p>
          </div>

          <h2 className="doc-h2">用户</h2>

          <div className="endpoint-block">
            <div className="endpoint-header">
              <span className="method-badge method-get">GET</span>
              <span className="endpoint-path">/me</span>
            </div>
            <p className="doc-p">获取当前用户信息。</p>
            <div className="doc-code">{`{
  <span class="key">"id"</span>: <span class="str">"usr_xxx"</span>,
  <span class="key">"nickname"</span>: <span class="str">"夜行的人"</span>,
  <span class="key">"stats"</span>: {
    <span class="key">"collected"</span>: <span class="num">3</span>,
    <span class="key">"records"</span>: <span class="num">5</span>,
    <span class="key">"nights"</span>: <span class="num">2</span>
  }
}`}</div>
          </div>

          <h2 className="doc-h2">错误码</h2>
          <table className="doc-table">
            <thead>
              <tr>
                <th>code</th>
                <th>说明</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>0</td><td>成功</td></tr>
              <tr><td>40001</td><td>参数错误</td></tr>
              <tr><td>40101</td><td>未授权 / token 失效</td></tr>
              <tr><td>40301</td><td>无权限</td></tr>
              <tr><td>40401</td><td>资源不存在</td></tr>
              <tr><td>50001</td><td>识别服务异常</td></tr>
              <tr><td>50002</td><td>音频质量不足，无法识别</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

window.ApiDoc = ApiDoc;
