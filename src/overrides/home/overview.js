    /**
     * The panel's Overview tab: the six stat cells, the heat grid, and Claude
     * Code's yardstick line.
     *
     * The frame is drawn before any number arrives — the cells keep their
     * geometry and show a skeleton — so the page never shifts under the pointer
     * when the roll-up lands. A figure the source cannot answer is a dash, not a
     * zero and not a skeleton: the skeleton means "still loading", which a
     * missing figure is not.
     *
     * @returns `{ view(data) }`, where `data` is `homePanelData`'s answer.
     */
    function createHomeOverview() {
      function statCell(key, label, text, skeleton) {
        return React.createElement(
          'div',
          { key: key, className: 'dsh-claude-home-stat', 'data-skeleton': skeleton ? '' : undefined },
          React.createElement('span', { className: 'dsh-claude-home-stat-label' }, label),
          React.createElement('span', { className: 'dsh-claude-home-stat-value', title: skeleton ? undefined : text }, skeleton ? '' : text),
        )
      }

      function view(data) {
        var skeleton = !data.known
        return React.createElement(
          React.Fragment,
          null,
          React.createElement(
            'div',
            { className: 'dsh-claude-home-stats' },
            statCell('sessions', copyLabel('homeSessions', 'Sessions'), data.sessions === null ? '—' : formatHomeCount(data.sessions), skeleton),
            statCell('calls', copyLabel('homeCalls', 'Calls'), data.calls === null ? '—' : formatHomeCount(data.calls), skeleton),
            statCell('tokens', copyLabel('homeTokens', 'Tokens'), formatHomeTokens(data.tokens), skeleton),
            statCell('days', copyLabel('homeActiveDays', 'Active days'), data.activeDays === null ? '—' : formatHomeCount(data.activeDays), skeleton),
            statCell('peak', copyLabel('homePeakHour', 'Peak hour'), data.peakHour === null ? '—' : data.peakHour, skeleton),
            statCell('model', copyLabel('homeTopModel', 'Top model'), data.model === null ? '—' : data.model, skeleton),
          ),
          React.createElement(
            'div',
            { className: 'dsh-claude-home-heat', 'data-skeleton': data.known ? undefined : '' },
            data.grid.cells.map(function (cell) {
              return React.createElement('span', {
                key: cell.date,
                className: 'dsh-claude-home-heat-cell',
                'data-level': cell.level,
                title: cell.date + ' · ' + formatHomeTokens(cell.tokens),
              })
            }),
          ),
          data.fun === null ? null : React.createElement('span', { className: 'dsh-claude-home-fun' }, data.fun),
        )
      }

      return { view: view }
    }
