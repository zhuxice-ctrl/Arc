// API Documentation Page
const ApiDocsPage = ({ onBack }) => {
  const [expanded, setExpanded] = React.useState(0);

  const apis = [
    {
      method: 'GET',
      endpoint: '/api/herbs',
      desc: '获取草药列表，支持分页、分类筛选和搜索',
      request: 'GET /api/herbs?category=补虚药&page=1&pageSize=20',
      response: `{
  "code": 0,
  "message": "success",
  "data": {
    "list": [
      {
        "id": "danggui",
        "name": "当归",
        "pinyin": "Dāng Guī",
        "nature": "温",
        "taste": "甘、辛",
        "meridian": "肝、心、脾经",
        "category": "补虚药",
        "effect": "补血活血，调经止痛...",
        "icon": "🌿"
      }
    ],
    "total": 24,
    "page": 1,
    "pageSize": 20
  }
}`
    },
    {
      method: 'GET',
      endpoint: '/api/herbs/:id',
      desc: '获取单个草药的详细信息',
      request: 'GET /api/herbs/danggui',
      response: `{
  "code": 0,
  "data": {
    "id": "danggui",
    "name": "当归",
    "pinyin": "Dāng Guī",
    "nature": "温",
    "taste": "甘、辛",
    "meridian": "肝、心、脾经",
    "category": "补虚药",
    "effect": "补血活血，调经止痛，润肠通便",
    "processing": "酒炙当归可增强...",
    "taboo": "湿盛中满、大便泄泻者忌服",
    "description": "当归为伞形科植物当归的干燥根...",
    "classic": "《本草正》：当归，其味甘而重..."
  }
}`
    },
    {
      method: 'GET',
      endpoint: '/api/prescriptions',
      desc: '获取药方列表',
      request: 'GET /api/prescriptions?type=classic',
      response: `{
  "code": 0,
  "data": {
    "list": [
      {
        "id": "siwu-tang",
        "name": "四物汤",
        "classic": true,
        "source": "《太平惠民和剂局方》",
        "herbs": ["熟地黄", "当归", "白芍", "川芎"],
        "effect": "补血调血...",
        "usage": "每服三钱，水一盏半..."
      }
    ],
    "total": 6
  }
}`
    },
    {
      method: 'GET',
      endpoint: '/api/solar-terms',
      desc: '获取二十四节气及对应养生建议',
      request: 'GET /api/solar-terms',
      response: `{
  "code": 0,
  "data": [
    {
      "term": "立春",
      "date": "02-04",
      "month": "二月",
      "herb": "枸杞",
      "icon": "🍒",
      "tip": "立春养肝，枸杞明目益精..."
    }
    // ... 共 24 个节气
  ]
}`
    },
    {
      method: 'POST',
      endpoint: '/api/cabinet/herbs',
      desc: '将草药添加到个人药柜',
      request: `POST /api/cabinet/herbs
Content-Type: application/json

{
  "herbId": "danggui",
  "quantity": 50,
  "unit": "g",
  "note": "岷县产当归头",
  "expireDate": "2026-08-15"
}`,
      response: `{
  "code": 0,
  "message": "添加成功",
  "data": {
    "id": "cab_xxx",
    "herbId": "danggui",
    "addedAt": "2025-08-17T10:30:00Z"
  }
}`
    },
    {
      method: 'POST',
      endpoint: '/api/prescriptions',
      desc: '创建自定义药方',
      request: `POST /api/prescriptions
Content-Type: application/json

{
  "name": "我的养生茶",
  "herbs": [
    { "herbId": "gouqi", "amount": "10g" },
    { "herbId": "juhua", "amount": "5g" }
  ],
  "note": "日常明目茶饮",
  "isPublic": false
}`,
      response: `{
  "code": 0,
  "message": "创建成功",
  "data": {
    "id": "rx_xxxx",
    "name": "我的养生茶",
    "herbsCount": 2,
    "createdAt": "2025-08-17T10:30:00Z"
  }
}`
    },
    {
      method: 'PUT',
      endpoint: '/api/users/profile',
      desc: '更新用户个人信息',
      request: `PUT /api/users/profile
Content-Type: application/json

{
  "nickname": "李时珍的药柜",
  "avatar": "base64...",
  "constitution": "气虚质"
}`,
      response: `{
  "code": 0,
  "message": "更新成功"
}`
    },
    {
      method: 'GET',
      endpoint: '/api/users/stats',
      desc: '获取用户学习统计数据',
      request: 'GET /api/users/stats',
      response: `{
  "code": 0,
  "data": {
    "collectedHerbs": 24,
    "totalHerbs": 500,
    "learnedPrescriptions": 6,
    "studyDays": 12,
    "achievements": 3,
    "currentLevel": "药童",
    "nextLevelProgress": 0.48
  }
}`
    }
  ];

  // Simple syntax highlighting
  const renderCode = (code) => {
    let highlighted = code
      .replace(/"([^"]+)":/g, '<span class="key">"$1"</span>:')
      .replace(/: "([^"]+)"/g, ': <span class="str">"$1"</span>')
      .replace(/: (\d+)/g, ': <span class="num">$1</span>')
      .replace(/(\/\/.*)/g, '<span class="com">$1</span>')
      .replace(/(GET|POST|PUT|DELETE) /g, '<span class="key">$1</span> ');
    
    return <pre className="code-block" dangerouslySetInnerHTML={{ __html: highlighted }} />;
  };

  const methodClass = (method) => {
    switch (method) {
      case 'GET': return 'method-get';
      case 'POST': return 'method-post';
      case 'PUT': return 'method-put';
      case 'DELETE': return 'method-delete';
      default: return 'method-get';
    }
  };

  return (
    <div className="screen" id="screen-api">
      <div className="secondary-nav">
        <div className="back-btn" onClick={onBack}>
          <Icon.ChevronLeft size={20} color="var(--ink-black)" />
        </div>
        <div className="nav-title">接口文档</div>
        <div className="nav-spacer" />
      </div>

      <div className="api-container">
        <div style={{
          padding: 16,
          background: 'var(--rice-paper)',
          borderRadius: 'var(--radius-md)',
          fontSize: 12,
          lineHeight: 1.7,
          color: 'var(--ink-black)'
        }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8, color: 'var(--herb-green)' }}>
            🌿 百草集 API v1.0
          </div>
          Base URL: <code style={{
            fontFamily: 'monospace',
            background: 'white',
            padding: '2px 6px',
            borderRadius: 4,
            fontSize: 11
          }}>https://api.baicaoji.com/v1</code>
          <br />
          数据格式：JSON &nbsp;|&nbsp; 认证：Bearer Token
        </div>

        {apis.map((api, idx) => (
          <div
            key={idx}
            className={`api-card ${expanded === idx ? 'expanded' : ''}`}
          >
            <div
              className="api-card-header"
              onClick={() => setExpanded(expanded === idx ? -1 : idx)}
            >
              <span className={`method-badge ${methodClass(api.method)}`}>
                {api.method}
              </span>
              <span className="api-endpoint">{api.endpoint}</span>
              <span className="api-chevron">
                <Icon.ChevronDown size={14} color="var(--gray-brown)" />
              </span>
            </div>
            <div className="api-card-body">
              <div className="api-desc">{api.desc}</div>
              <div className="code-label">请求示例</div>
              {renderCode(api.request)}
              <div className="code-label">响应示例</div>
              {renderCode(api.response)}
            </div>
          </div>
        ))}

        <div style={{
          padding: 16,
          background: 'var(--herb-green-light)',
          borderRadius: 'var(--radius-md)',
          fontSize: 12,
          lineHeight: 1.7,
          color: 'var(--ink-black)',
          marginBottom: 20
        }}>
          <div style={{ fontWeight: 700, marginBottom: 6, color: 'var(--herb-green)' }}>
            状态码说明
          </div>
          <div>0 - 成功</div>
          <div>400 - 请求参数错误</div>
          <div>401 - 未授权</div>
          <div>404 - 资源不存在</div>
          <div>500 - 服务器内部错误</div>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { ApiDocsPage });
