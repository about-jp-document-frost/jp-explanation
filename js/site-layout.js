(function () {
  function getBasePath() {
    var pathname = window.location.pathname;

    if (pathname.indexOf('/document/') !== -1) {
      return pathname.split('/document/')[0] + '/';
    }

    if (pathname.indexOf('/templates/') !== -1) {
      return pathname.split('/templates/')[0] + '/';
    }

    return pathname.replace(/[^/]*$/, '/');
  }

  function normalizePath(pathname) {
    return pathname.replace(/\/+/g, '/').replace(/\/index\.html$/, '/').replace(/\/$/, '');
  }

  function getConfig() {
    if (window.SIDEBAR_CONFIG && Array.isArray(window.SIDEBAR_CONFIG.groups)) {
      return window.SIDEBAR_CONFIG;
    }

    return {
      topLinks: [['index.html', 'Home']],
      groups: [
        { key: 'culture', title: 'Culture', links: [['document/culture/index.html', 'Index']] },
        { key: 'device', title: 'Device', links: [['document/device/index.html', 'Index']] },
        { key: 'education', title: 'Education', links: [['document/education/index.html', 'Index']] },
        { key: 'jp-learning', title: 'JP Learning', links: [['document/jp-learning/index.html', 'Index']] },
        { key: 'life', title: 'Life', links: [['document/life/index.html', 'Index']] },
        { key: 'work', title: 'Work', links: [['document/work/index.html', 'Index']] }
      ]
    };
  }

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function buildNavLinks(basePath, currentPath, config) {
    var links = [];

    (config.topLinks || []).forEach(function (item) {
      var href = item[0];
      var label = item[1];
      var targetPath = normalizePath((new URL(href, window.location.origin + basePath)).pathname);
      var currentClass = targetPath === currentPath ? ' class="is-current"' : '';

      links.push('<a href="' + escapeHtml(basePath + href) + '"' + currentClass + '>' + escapeHtml(label) + '</a>');
    });

    (config.groups || []).forEach(function (group) {
      if (!group.links || !group.links.length) {
        return;
      }

      var href = group.links[0][0];
      var label = group.title;
      var targetPath = normalizePath((new URL(href, window.location.origin + basePath)).pathname);
      var currentClass = currentPath.indexOf('/document/' + group.key) !== -1 || targetPath === currentPath ? ' class="is-current"' : '';

      links.push('<a href="' + escapeHtml(basePath + href) + '"' + currentClass + '>' + escapeHtml(label) + '</a>');
    });

    return links.join('');
  }

  function buildHeaderHTML(basePath, currentPath, config) {
    return [
      '<header class="site-header">',
      '  <div class="container nav">',
      '    <a class="brand" href="' + escapeHtml(basePath + 'index.html') + '">Japan Guide &amp; Q&amp;A</a>',
      '    <nav class="nav-links">' + buildNavLinks(basePath, currentPath, config) + '</nav>',
      '  </div>',
      '</header>'
    ].join('');
  }

  function buildFooterHTML() {
    return [
      '<footer class="site-footer">',
      '  <p>&copy; 2026 A frosty guy from Japan &amp; Q&amp;A. All rights reserved.</p>',
      '</footer>'
    ].join('');
  }

  function renderChrome() {
    var basePath = getBasePath();
    var currentPath = normalizePath(window.location.pathname);
    var config = getConfig();
    var headerRoot = document.querySelector('[data-site-header]');
    var footerRoot = document.querySelector('[data-site-footer]');

    if (headerRoot) {
      headerRoot.innerHTML = buildHeaderHTML(basePath, currentPath, config);
    }

    if (footerRoot) {
      footerRoot.innerHTML = buildFooterHTML();
    }
  }

  window.SiteLayout = {
    buildHeaderHTML: buildHeaderHTML,
    buildFooterHTML: buildFooterHTML,
    renderChrome: renderChrome
  };

  renderChrome();
})();