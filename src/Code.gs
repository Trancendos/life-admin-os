// =================================================================
// == Life Admin OS - Production Code (All Bugs Fixed)
// == Version: 2.0.1
// == Auto-deployed via GitHub Actions
// =================================================================

// =================================================================
// == CONFIGURATION & CONSTANTS
// =================================================================

const STATS_SHEET_NAME = 'LabelStats';
const SETTINGS_SHEET_NAME = 'Settings';
const THEME_CONFIG_SHEET_NAME = 'ThemeConfig';
const ACTION_ITEMS_SHEET_NAME = 'Action Items';
const SUBSCRIPTIONS_SHEET_NAME = 'Subscriptions';
const RECEIPTS_SHEET_NAME = 'Receipts';
const COMPLIANCE_LOG_SHEET_NAME = 'ComplianceLog';
const INTEGRATIONS_SHEET_NAME = 'Integrations';

// =================================================================
// == MENU & UI
// =================================================================

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Life Admin OS')
    .addItem('🚀 Launch Dashboard', 'showWebApp')
    .addSeparator()
    .addItem('📧 Run Appointment Scan', 'runAppointmentScan')
    .addItem('💰 Check Subscriptions', 'runSubscriptionCheck')
    .addSeparator()
    .addItem('⚙️ Initialize/Reset Sheets', 'initializeSettingsSheet')
    .addItem('🔄 Sync Automation Triggers', 'syncTriggers')
    .addToUi();
}

function doGet() {
  return HtmlService.createHtmlOutputFromFile('WebAppUI')
    .setTitle('Life Admin OS Dashboard')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function showWebApp() {
  const html = HtmlService.createHtmlOutputFromFile('WebAppUI')
    .setWidth(800)
    .setHeight(700);
  SpreadsheetApp.getUi().showModalDialog(html, 'Life Admin OS Dashboard');
}

// =================================================================
// == SETTINGS & CONFIGURATION
// =================================================================

function readSettings() {
  const ss = getTargetSheet();
  const sheet = ss.getSheetByName(SETTINGS_SHEET_NAME);
  if (!sheet) {
    throw new Error(`Settings sheet not found. Please run Initialize/Reset Sheets.`);
  }
  
  const data = sheet.getDataRange().getValues();
  const settings = {};
  
  for (let i = 1; i < data.length; i++) {
    const key = data[i][0];
    const value = data[i][1];
    if (key) {
      settings[key] = value;
    }
  }
  
  return settings;
}

function isFeatureEnabled(featureName) {
  try {
    const settings = readSettings();
    const value = settings[featureName];
    return value === true || value === 'true' || value === 'TRUE';
  } catch (e) {
    logError('isFeatureEnabled', e);
    return false;
  }
}

function getTargetSheet() {
  return SpreadsheetApp.getActiveSpreadsheet();
}

// =================================================================
// == INITIALIZATION
// =================================================================

function initializeSettingsSheet() {
  const ss = getTargetSheet();
  
  // Create or get Settings sheet
  let settingsSheet = ss.getSheetByName(SETTINGS_SHEET_NAME);
  if (!settingsSheet) {
    settingsSheet = ss.insertSheet(SETTINGS_SHEET_NAME);
  } else {
    settingsSheet.clear();
  }
  
  const settingsData = [
    ['Setting', 'Value', 'Description'],
    ['DAYS_TO_SCAN', 90, 'Number of days to scan backwards'],
    ['SEARCH_SCOPE', 'in:inbox', 'Gmail search scope'],
    ['MIN_EMAILS_FOR_LABEL', 5, 'Minimum emails to create a label'],
    ['LABEL_PREFIX', 'Appointments/', 'Prefix for created labels'],
    ['SEND_EMAIL_DIGEST', true, 'Send email summary after scan'],
    ['BATCH_SIZE', 50, 'Number of emails per batch'],
    ['APPOINTMENT_SCAN_FREQUENCY', 'Every 6 hours', 'How often to run appointment scan'],
    ['SUBSCRIPTION_CHECK_DAY', 'Monday', 'Day of week for subscription check'],
    ['CREATE_ACTION_ITEMS', true, 'Auto-generate action items'],
    ['HIGH_PRIORITY_THEMES', 'Government,NHS', 'Themes that generate action items'],
    ['', '', ''],
    ['=== FEATURE TOGGLES ===', '', ''],
    ['ENABLE_AI_CLASSIFICATION', false, 'Use Google Gemini for classification'],
    ['ENABLE_SMART_TAGGING', true, 'Enable compliance audit trails'],
    ['ENABLE_SUBSCRIPTION_TRACKING', true, 'Track recurring payments'],
    ['ENABLE_RECEIPT_SCANNER', false, 'Scan receipts (not implemented)'],
    ['ENABLE_CALENDAR_INTEGRATION', false, 'Create calendar events'],
    ['ENABLE_MULTI_CATEGORY_ROUTING', true, 'Allow multiple categories per email'],
    ['', '', ''],
    ['=== INTEGRATIONS ===', '', ''],
    ['ENABLE_SLACK', false, 'Send notifications to Slack'],
    ['ENABLE_DISCORD', false, 'Send notifications to Discord'],
    ['ENABLE_ZAPIER', false, 'Trigger Zapier webhooks'],
    ['ENABLE_TRELLO', false, 'Create Trello cards'],
    ['ENABLE_LINEAR', false, 'Create Linear issues'],
    ['ENABLE_NOTION', false, 'Create Notion pages'],
    ['ENABLE_WHATSAPP', false, 'Send WhatsApp alerts'],
    ['ENABLE_TODOIST', false, 'Create Todoist tasks']
  ];
  
  settingsSheet.getRange(1, 1, settingsData.length, 3).setValues(settingsData);
  settingsSheet.getRange(1, 1, 1, 3).setFontWeight('bold').setBackground('#4285f4').setFontColor('white');
  settingsSheet.setFrozenRows(1);
  settingsSheet.autoResizeColumns(1, 3);
  
  // Create ThemeConfig sheet
  let themeSheet = ss.getSheetByName(THEME_CONFIG_SHEET_NAME);
  if (!themeSheet) {
    themeSheet = ss.insertSheet(THEME_CONFIG_SHEET_NAME);
  } else {
    themeSheet.clear();
  }
  
  const themeData = [
    ['Theme', 'Keywords'],
    ['Healthcare', 'appointment,clinic,doctor,hospital,NHS,medical,surgery,dentist,optician'],
    ['Government', 'HMRC,tax,council,gov.uk,passport,DVLA,benefits,pension'],
    ['Finance', 'bank,payment,invoice,statement,credit card,loan,mortgage'],
    ['Travel', 'booking,flight,hotel,train,car hire,visa,travel'],
    ['Delivery', 'delivery,parcel,shipment,tracking,courier,DPD,Royal Mail'],
    ['Utilities', 'energy,water,gas,electric,broadband,phone,council tax'],
    ['Education', 'university,course,exam,school,college,training'],
    ['Entertainment', 'event,concert,cinema,theatre,tickets,show']
  ];
  
  themeSheet.getRange(1, 1, themeData.length, 2).setValues(themeData);
  themeSheet.getRange(1, 1, 1, 2).setFontWeight('bold').setBackground('#34a853').setFontColor('white');
  themeSheet.setFrozenRows(1);
  themeSheet.autoResizeColumns(1, 2);
  
  // Create LabelStats sheet
  let statsSheet = ss.getSheetByName(STATS_SHEET_NAME);
  if (!statsSheet) {
    statsSheet = ss.insertSheet(STATS_SHEET_NAME);
  } else {
    statsSheet.clear();
  }
  
  const statsHeaders = [['Domain', 'Theme', 'Theme Count', 'Total Emails', 'Label Name', 'Last Updated']];
  statsSheet.getRange(1, 1, 1, 6).setValues(statsHeaders);
  statsSheet.getRange(1, 1, 1, 6).setFontWeight('bold').setBackground('#fbbc04').setFontColor('white');
  statsSheet.setFrozenRows(1);
  statsSheet.autoResizeColumns(1, 6);
  
  // Create Action Items sheet
  let actionSheet = ss.getSheetByName(ACTION_ITEMS_SHEET_NAME);
  if (!actionSheet) {
    actionSheet = ss.insertSheet(ACTION_ITEMS_SHEET_NAME);
  } else {
    actionSheet.clear();
  }
  
  const actionHeaders = [['Status', 'Priority', 'Theme', 'Subject', 'From', 'Date', 'Action Required']];
  actionSheet.getRange(1, 1, 1, 7).setValues(actionHeaders);
  actionSheet.getRange(1, 1, 1, 7).setFontWeight('bold').setBackground('#ea4335').setFontColor('white');
  actionSheet.setFrozenRows(1);
  actionSheet.autoResizeColumns(1, 7);
  
  // Create Subscriptions sheet
  let subsSheet = ss.getSheetByName(SUBSCRIPTIONS_SHEET_NAME);
  if (!subsSheet) {
    subsSheet = ss.insertSheet(SUBSCRIPTIONS_SHEET_NAME);
  } else {
    subsSheet.clear();
  }
  
  const subsHeaders = [['Service/Domain', 'Email Count', 'Last Seen', 'Sample Subject', 'Estimated Cost']];
  subsSheet.getRange(1, 1, 1, 5).setValues(subsHeaders);
  subsSheet.getRange(1, 1, 1, 5).setFontWeight('bold').setBackground('#9c27b0').setFontColor('white');
  subsSheet.setFrozenRows(1);
  subsSheet.autoResizeColumns(1, 5);
  
  // Create Receipts sheet
  let receiptsSheet = ss.getSheetByName(RECEIPTS_SHEET_NAME);
  if (!receiptsSheet) {
    receiptsSheet = ss.insertSheet(RECEIPTS_SHEET_NAME);
  } else {
    receiptsSheet.clear();
  }
  
  const receiptsHeaders = [['Date', 'Vendor', 'Amount', 'Category', 'Payment Method', 'Email Subject']];
  receiptsSheet.getRange(1, 1, 1, 6).setValues(receiptsHeaders);
  receiptsSheet.getRange(1, 1, 1, 6).setFontWeight('bold').setBackground('#00bcd4').setFontColor('white');
  receiptsSheet.setFrozenRows(1);
  receiptsSheet.autoResizeColumns(1, 6);
  
  // Create ComplianceLog sheet
  let complianceSheet = ss.getSheetByName(COMPLIANCE_LOG_SHEET_NAME);
  if (!complianceSheet) {
    complianceSheet = ss.insertSheet(COMPLIANCE_LOG_SHEET_NAME);
  } else {
    complianceSheet.clear();
  }
  
  const complianceHeaders = [['Timestamp', 'UUID', 'Action', 'Status', 'User', 'Duration (ms)', 'Details']];
  complianceSheet.getRange(1, 1, 1, 7).setValues(complianceHeaders);
  complianceSheet.getRange(1, 1, 1, 7).setFontWeight('bold').setBackground('#607d8b').setFontColor('white');
  complianceSheet.setFrozenRows(1);
  complianceSheet.autoResizeColumns(1, 7);
  
  // Create Integrations sheet
  let integrationsSheet = ss.getSheetByName(INTEGRATIONS_SHEET_NAME);
  if (!integrationsSheet) {
    integrationsSheet = ss.insertSheet(INTEGRATIONS_SHEET_NAME);
  } else {
    integrationsSheet.clear();
  }
  
  const integrationsData = [
    ['Integration', 'API Key / Webhook URL', 'Status'],
    ['Slack', '', 'Not Configured'],
    ['Discord', '', 'Not Configured'],
    ['Zapier', '', 'Not Configured'],
    ['Trello', '', 'Not Configured'],
    ['Linear', '', 'Not Configured'],
    ['Notion', '', 'Not Configured'],
    ['Google Gemini', '', 'Not Configured'],
    ['WhatsApp', '', 'Not Configured'],
    ['Todoist', '', 'Not Configured']
  ];
  
  integrationsSheet.getRange(1, 1, integrationsData.length, 3).setValues(integrationsData);
  integrationsSheet.getRange(1, 1, 1, 3).setFontWeight('bold').setBackground('#ff9800').setFontColor('white');
  integrationsSheet.setFrozenRows(1);
  integrationsSheet.autoResizeColumns(1, 3);
  
  SpreadsheetApp.getUi().alert('✅ All sheets initialized successfully!\\n\\nYou can now configure your settings and run the appointment scan.');
}

// =================================================================
// == MAIN APPOINTMENT SCAN FUNCTION (BUG FIXED)
// =================================================================

function runAppointmentScan() {
  const startTime = Date.now();
  
  try {
    const config = readSettings();
    const daysToScan = config.DAYS_TO_SCAN || 90;
    const searchScope = config.SEARCH_SCOPE || 'in:inbox';
    const minEmailsForLabel = config.MIN_EMAILS_FOR_LABEL || 5;
    const labelPrefix = config.LABEL_PREFIX || 'Appointments/';
    const batchSize = config.BATCH_SIZE || 50;
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToScan);
    const query = `${searchScope} after:${formatDateYYYYMMDD(cutoffDate)}`;
    
    const threads = GmailApp.search(query, 0, batchSize);
    logInfo(`Found ${threads.length} threads to process.`);
    
    const domainStats = {};
    const themes = readThemeConfig();
    const labelMap = {};
    
    threads.forEach(thread => {
      const messages = thread.getMessages();
      messages.forEach(msg => {
        const from = msg.getFrom();
        const subject = msg.getSubject();
        const body = msg.getPlainBody().substring(0, 1000).toLowerCase();
        const domain = extractDomain(from);
        
        if (!domainStats[domain]) {
          domainStats[domain] = { count: 0, themes: {} };
        }
        domainStats[domain].count++;
        
        const detectedThemes = detectThemes(subject, body, themes);
        detectedThemes.forEach(theme => {
          if (!domainStats[domain].themes[theme]) {
            domainStats[domain].themes[theme] = 0;
          }
          domainStats[domain].themes[theme]++;
          
          const labelName = `${labelPrefix}${theme}/${domain}`;
          if (!labelMap[labelName]) {
            labelMap[labelName] = getOrCreateLabel(labelName);
          }
          thread.addLabel(labelMap[labelName]);
        });
      });
    });
    
    // BUG FIX: Safe sheet update with validation
    updateDashboardSheet(domainStats, themes, labelPrefix);
    
    // Generate action items if enabled
    if (config.CREATE_ACTION_ITEMS === true || config.CREATE_ACTION_ITEMS === 'true') {
      generateActionItems(threads, config.HIGH_PRIORITY_THEMES);
    }
    
    const duration = Date.now() - startTime;
    tagAction('appointment_scan', { 
      duration_ms: duration, 
      status: 'success',
      threads_processed: threads.length,
      labels_created: Object.keys(labelMap).length
    });
    
    if (config.SEND_EMAIL_DIGEST === true || config.SEND_EMAIL_DIGEST === 'true') {
      sendDigestEmail(labelMap, domainStats);
    }
    
    logInfo(`✅ Scan complete! Processed ${threads.length} threads, created ${Object.keys(labelMap).length} labels.`);
    return `Scan complete! Processed ${threads.length} threads.`;
    
  } catch (e) {
    const duration = Date.now() - startTime;
    tagAction('appointment_scan', { 
      duration_ms: duration, 
      status: 'error',
      error: e.message
    });
    logError('runAppointmentScan', e);
    sendErrorNotification(e, 'runAppointmentScan');
    throw new Error(`Appointment Scan Failed: ${e.message}`);
  }
}

// BUG FIX: Safe dashboard update with proper validation
function updateDashboardSheet(domainStats, themes, labelPrefix) {
  const ss = getTargetSheet();
  let sheet = ss.getSheetByName(STATS_SHEET_NAME);
  if (!sheet) throw new Error(`Sheet "${STATS_SHEET_NAME}" not found.`);
  
  // BUG FIX: Check if there are rows to clear before attempting clearContents
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, 6).clearContents();
  }
  
  let outputRows = [];
  Object.entries(domainStats).forEach(([domain, stats]) => {
    Object.entries(stats.themes).forEach(([theme, themeCount]) => {
      const labelName = `${labelPrefix}${theme}/${domain}`;
      outputRows.push([domain, theme, themeCount, stats.count, labelName, new Date()]);
    });
  });
  
  if (outputRows.length > 0) {
    sheet.getRange(2, 1, outputRows.length, 6).setValues(outputRows);
  }
  logInfo(`Dashboard updated with ${outputRows.length} rows.`);
}

// =================================================================
// == SUBSCRIPTION TRACKING (BUG FIXED)
// =================================================================

function runSubscriptionCheck() {
  return checkSubscriptions();
}

function checkSubscriptions() {
  if (!isFeatureEnabled('SUBSCRIPTION_TRACKING')) {
    return 'Subscription tracking is disabled';
  }
  
  const startTime = Date.now();
  
  try {
    const config = readSettings();
    const daysToScan = 30;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToScan);
    
    const query = `subject:(subscription OR renewal OR payment OR invoice OR receipt) after:${formatDateYYYYMMDD(cutoffDate)}`;
    const threads = GmailApp.search(query, 0, 100);
    
    logInfo(`Found ${threads.length} potential subscription emails.`);
    
    const subscriptions = {};
    const subscriptionKeywords = ['subscription', 'renewal', 'recurring', 'monthly', 'annual', 'membership'];
    
    threads.forEach(thread => {
      const messages = thread.getMessages();
      messages.forEach(msg => {
        const from = msg.getFrom();
        const subject = msg.getSubject();
        const body = msg.getPlainBody().substring(0, 2000).toLowerCase();
        const domain = extractDomain(from);
        
        const isSubscription = subscriptionKeywords.some(kw => 
          subject.toLowerCase().includes(kw) || body.includes(kw)
        );
        
        if (isSubscription) {
          if (!subscriptions[domain]) {
            subscriptions[domain] = {
              count: 0,
              lastDate: msg.getDate(),
              subjects: [],
              estimatedCost: 0
            };
          }
          subscriptions[domain].count++;
          subscriptions[domain].subjects.push(subject);
          if (msg.getDate() > subscriptions[domain].lastDate) {
            subscriptions[domain].lastDate = msg.getDate();
          }
          
          const cost = extractCostFromEmail(body);
          if (cost > 0) {
            subscriptions[domain].estimatedCost = cost;
          }
        }
      });
    });
    
    // BUG FIX: Safe sheet update with validation
    const ss = getTargetSheet();
    let sheet = ss.getSheetByName(SUBSCRIPTIONS_SHEET_NAME);
    if (!sheet) throw new Error(`Sheet "${SUBSCRIPTIONS_SHEET_NAME}" not found.`);
    
    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      sheet.getRange(2, 1, lastRow - 1, 5).clearContents();
    }
    
    const outputRows = Object.entries(subscriptions).map(([domain, data]) => [
      domain,
      data.count,
      data.lastDate,
      data.subjects[0] || '',
      data.estimatedCost > 0 ? `£${data.estimatedCost.toFixed(2)}` : 'Unknown'
    ]);
    
    if (outputRows.length > 0) {
      sheet.getRange(2, 1, outputRows.length, 5).setValues(outputRows);
    }
    
    const duration = Date.now() - startTime;
    tagAction('subscription_scan', { 
      duration_ms: duration, 
      status: 'success',
      subscriptions_found: Object.keys(subscriptions).length
    });
    
    logInfo(`✅ Subscription scan complete. Found ${Object.keys(subscriptions).length} services.`);
    return `Found ${Object.keys(subscriptions).length} subscription services.`;
    
  } catch (e) {
    const duration = Date.now() - startTime;
    tagAction('subscription_scan', { 
      duration_ms: duration, 
      status: 'error',
      error: e.message
    });
    logError('checkSubscriptions', e);
    sendErrorNotification(e, 'checkSubscriptions');
    throw new Error(`Subscription Check Failed: ${e.message}`);
  }
}

function extractCostFromEmail(body) {
  const patterns = [
    /£(\d+\.?\d*)/,
    /\$(\d+\.?\d*)/,
    /(\d+\.?\d*)\s*GBP/i,
    /(\d+\.?\d*)\s*USD/i,
    /total[:\s]+£?(\d+\.?\d*)/i,
    /amount[:\s]+£?(\d+\.?\d*)/i
  ];
  
  for (const pattern of patterns) {
    const match = body.match(pattern);
    if (match && match[1]) {
      const amount = parseFloat(match[1]);
      if (amount > 0 && amount < 10000) {
        return amount;
      }
    }
  }
  return 0;
}

// =================================================================
// == RECEIPT SCANNER (PLACEHOLDER - NOT IMPLEMENTED)
// =================================================================

function runReceiptScan() {
  if (!isFeatureEnabled('RECEIPT_SCANNER')) {
    return 'Receipt scanner is disabled';
  }
  
  // This feature requires Google Vision API or similar OCR service
  // For now, return a placeholder message
  logInfo('Receipt scanning requested but not yet implemented.');
  return 'Feature In Progress: AI Receipt scanning is not yet implemented.';
}

// =================================================================
// == HELPER FUNCTIONS
// =================================================================

function readThemeConfig() {
  const ss = getTargetSheet();
  const sheet = ss.getSheetByName(THEME_CONFIG_SHEET_NAME);
  if (!sheet) return {};
  
  const data = sheet.getDataRange().getValues();
  const themes = {};
  
  for (let i = 1; i < data.length; i++) {
    const theme = data[i][0];
    const keywords = data[i][1];
    if (theme && keywords) {
      themes[theme] = keywords.toLowerCase().split(',').map(k => k.trim());
    }
  }
  
  return themes;
}

function detectThemes(subject, body, themes) {
  const detected = [];
  const text = (subject + ' ' + body).toLowerCase();
  
  Object.entries(themes).forEach(([theme, keywords]) => {
    const matched = keywords.some(kw => text.includes(kw));
    if (matched) {
      detected.push(theme);
    }
  });
  
  return detected.length > 0 ? detected : ['Uncategorized'];
}

function extractDomain(email) {
  const match = email.match(/@([^>]+)/);
  return match ? match[1].trim() : email;
}

function getOrCreateLabel(labelName) {
  let label = GmailApp.getUserLabelByName(labelName);
  if (!label) {
    label = GmailApp.createLabel(labelName);
    logInfo(`Created label: ${labelName}`);
  }
  return label;
}

function formatDateYYYYMMDD(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
}

// =================================================================
// == ACTION ITEMS GENERATION
// =================================================================

function generateActionItems(threads, highPriorityThemes) {
  const ss = getTargetSheet();
  let sheet = ss.getSheetByName(ACTION_ITEMS_SHEET_NAME);
  if (!sheet) return;
  
  const priorityThemes = (highPriorityThemes || 'Government,NHS').split(',').map(t => t.trim().toLowerCase());
  const themes = readThemeConfig();
  const actionItems = [];
  
  threads.forEach(thread => {
    const messages = thread.getMessages();
    messages.forEach(msg => {
      const subject = msg.getSubject();
      const body = msg.getPlainBody().substring(0, 1000).toLowerCase();
      const from = msg.getFrom();
      const date = msg.getDate();
      
      const detectedThemes = detectThemes(subject, body, themes);
      const isHighPriority = detectedThemes.some(theme => 
        priorityThemes.includes(theme.toLowerCase())
      );
      
      if (isHighPriority) {
        actionItems.push([
          'Pending',
          'High',
          detectedThemes.join(', '),
          subject,
          from,
          date,
          'Review and respond'
        ]);
      }
    });
  });
  
  if (actionItems.length > 0) {
    const lastRow = sheet.getLastRow();
    sheet.getRange(lastRow + 1, 1, actionItems.length, 7).setValues(actionItems);
    logInfo(`Generated ${actionItems.length} action items.`);
  }
}

// =================================================================
// == SMART TAGGING & COMPLIANCE
// =================================================================

function tagAction(action, context = {}) {
  if (!isFeatureEnabled('SMART_TAGGING')) {
    return null;
  }
  
  const tag = {
    timestamp: new Date(),
    uuid: Utilities.getUuid(),
    action: action,
    status: context.status || 'success',
    user: Session.getActiveUser().getEmail(),
    duration_ms: context.duration_ms || 0,
    details: JSON.stringify(context)
  };
  
  logComplianceEvent(tag);
  return tag;
}

function logComplianceEvent(tag) {
  try {
    const ss = getTargetSheet();
    let sheet = ss.getSheetByName(COMPLIANCE_LOG_SHEET_NAME);
    if (!sheet) return;
    
    const row = [
      tag.timestamp,
      tag.uuid,
      tag.action,
      tag.status,
      tag.user,
      tag.duration_ms,
      tag.details
    ];
    
    sheet.appendRow(row);
  } catch (e) {
    logError('logComplianceEvent', e);
  }
}

// =================================================================
// == LOGGING & ERROR HANDLING
// =================================================================

function logInfo(message) {
  Logger.log(`[INFO] ${message}`);
}

function logError(functionName, error) {
  Logger.log(`[ERROR] ${functionName}: ${error.message}`);
  Logger.log(error.stack);
}

function sendErrorNotification(error, functionName) {
  try {
    const config = readSettings();
    if (config.SEND_EMAIL_DIGEST === true || config.SEND_EMAIL_DIGEST === 'true') {
      GmailApp.sendEmail(
        Session.getActiveUser().getEmail(),
        `⚠️ Life Admin OS Error: ${functionName}`,
        `An error occurred in ${functionName}:\n\n${error.message}\n\n${error.stack}`,
        { htmlBody: `<h3>Error in ${functionName}</h3><p>${error.message}</p><pre>${error.stack}</pre>` }
      );
    }
  } catch (e) {
    logError('sendErrorNotification', e);
  }
}

// =================================================================
// == EMAIL DIGEST
// =================================================================

function sendDigestEmail(labelMap, domainStats) {
  const ss = getTargetSheet();
  if (!ss) {
    Logger.log("Cannot get target sheet for digest email. Aborting.");
    return;
  }
  
  const content = `
    <h2>Life Admin OS - Scan Complete</h2>
    <p>Labels created / updated: <b>${Object.keys(labelMap).length}</b></p>
    <p><a href="${ss.getUrl()}" target="_blank">Open Management Dashboard</a></p>
    <br>
    <p><b>Quick stats:</b></p>
    <ul>
      ${Object.entries(domainStats).slice(0, 20).map(([dom, s]) => 
        `<li><b>${dom}</b>: ${s.count} emails, themes: ${Object.keys(s.themes).join(', ')}</li>`
      ).join('')}
      ${Object.keys(domainStats).length > 20 ? '<li>...and more.</li>' : ''}
    </ul>
    <hr>
    <small>This digest was auto-generated by Life Admin OS.</small>
  `;

  GmailApp.sendEmail(
    Session.getActiveUser().getEmail(),
    "📂 Life Admin OS - Scan Complete", 
    "", 
    { htmlBody: content }
  );
}

// =================================================================
// == TRIGGER MANAGEMENT
// =================================================================

function syncTriggers() {
  // Delete all existing triggers
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => ScriptApp.deleteTrigger(trigger));
  
  const config = readSettings();
  const scanFreq = config.APPOINTMENT_SCAN_FREQUENCY || 'Every 6 hours';
  
  // Create appointment scan trigger
  if (scanFreq.includes('hour')) {
    const hours = parseInt(scanFreq.match(/\d+/)[0]);
    ScriptApp.newTrigger('runAppointmentScan')
      .timeBased()
      .everyHours(hours)
      .create();
  }
  
  // Create weekly subscription check trigger
  const checkDay = config.SUBSCRIPTION_CHECK_DAY || 'Monday';
  const dayMap = {
    'Monday': ScriptApp.WeekDay.MONDAY,
    'Tuesday': ScriptApp.WeekDay.TUESDAY,
    'Wednesday': ScriptApp.WeekDay.WEDNESDAY,
    'Thursday': ScriptApp.WeekDay.THURSDAY,
    'Friday': ScriptApp.WeekDay.FRIDAY,
    'Saturday': ScriptApp.WeekDay.SATURDAY,
    'Sunday': ScriptApp.WeekDay.SUNDAY
  };
  
  if (dayMap[checkDay]) {
    ScriptApp.newTrigger('runSubscriptionCheck')
      .timeBased()
      .onWeekDay(dayMap[checkDay])
      .atHour(9)
      .create();
  }
  
  logInfo('Triggers synced successfully.');
  return 'Triggers have been synced based on your settings.';
}

function syncTriggersNow() {
  try {
    syncTriggers();
    return "Triggers have been successfully synced based on the 'Settings' sheet.";
  } catch (e) {
    sendErrorNotification(e, 'syncTriggersNow');
    throw new Error(`Failed to sync triggers: ${e.message}`);
  }
}

// =================================================================
// == DASHBOARD API FUNCTIONS
// =================================================================

function getStats() {
  try {
    const ss = getTargetSheet();
    const statsSheet = ss.getSheetByName(STATS_SHEET_NAME);
    const subsSheet = ss.getSheetByName(SUBSCRIPTIONS_SHEET_NAME);
    const actionSheet = ss.getSheetByName(ACTION_ITEMS_SHEET_NAME);
    const complianceSheet = ss.getSheetByName(COMPLIANCE_LOG_SHEET_NAME);
    
    return {
      labelsCreated: statsSheet ? Math.max(0, statsSheet.getLastRow() - 1) : 0,
      subscriptionsFound: subsSheet ? Math.max(0, subsSheet.getLastRow() - 1) : 0,
      receiptsScanned: 0, // Not implemented yet
      actionItems: actionSheet ? Math.max(0, actionSheet.getLastRow() - 1) : 0,
      complianceEvents: complianceSheet ? Math.max(0, complianceSheet.getLastRow() - 1) : 0
    };
  } catch (e) {
    logError('getStats', e);
    return { labelsCreated: 0, subscriptionsFound: 0, receiptsScanned: 0, actionItems: 0, complianceEvents: 0 };
  }
}

function getFeatureStates() {
  try {
    const settings = readSettings();
    return {
      aiClassification: settings.ENABLE_AI_CLASSIFICATION === true || settings.ENABLE_AI_CLASSIFICATION === 'true',
      smartTagging: settings.ENABLE_SMART_TAGGING === true || settings.ENABLE_SMART_TAGGING === 'true',
      subscriptionTracking: settings.ENABLE_SUBSCRIPTION_TRACKING === true || settings.ENABLE_SUBSCRIPTION_TRACKING === 'true',
      receiptScanner: settings.ENABLE_RECEIPT_SCANNER === true || settings.ENABLE_RECEIPT_SCANNER === 'true',
      calendarIntegration: settings.ENABLE_CALENDAR_INTEGRATION === true || settings.ENABLE_CALENDAR_INTEGRATION === 'true',
      multiCategoryRouting: settings.ENABLE_MULTI_CATEGORY_ROUTING === true || settings.ENABLE_MULTI_CATEGORY_ROUTING === 'true'
    };
  } catch (e) {
    logError('getFeatureStates', e);
    return {};
  }
}

function getIntegrationStates() {
  try {
    const settings = readSettings();
    return {
      slack: settings.ENABLE_SLACK === true || settings.ENABLE_SLACK === 'true',
      discord: settings.ENABLE_DISCORD === true || settings.ENABLE_DISCORD === 'true',
      zapier: settings.ENABLE_ZAPIER === true || settings.ENABLE_ZAPIER === 'true',
      trello: settings.ENABLE_TRELLO === true || settings.ENABLE_TRELLO === 'true',
      linear: settings.ENABLE_LINEAR === true || settings.ENABLE_LINEAR === 'true',
      notion: settings.ENABLE_NOTION === true || settings.ENABLE_NOTION === 'true',
      whatsapp: settings.ENABLE_WHATSAPP === true || settings.ENABLE_WHATSAPP === 'true',
      todoist: settings.ENABLE_TODOIST === true || settings.ENABLE_TODOIST === 'true'
    };
  } catch (e) {
    logError('getIntegrationStates', e);
    return {};
  }
}
