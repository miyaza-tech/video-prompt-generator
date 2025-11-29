const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const promptGenerator = require('./utils/promptGenerator');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// Set EJS as template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// API endpoint to generate prompt
app.post('/api/generate-prompt', (req, res) => {
  try {
    const promptData = req.body;
    const generatedPrompt = promptGenerator.generate(promptData);
    res.json({ 
      success: true, 
      prompt: generatedPrompt 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// API endpoint to get templates
app.get('/api/templates', (req, res) => {
  try {
    const templates = promptGenerator.getTemplates();
    res.json({ 
      success: true, 
      templates 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// API endpoint to analyze story
app.post('/api/analyze-story', (req, res) => {
  try {
    console.log('스토리 분석 요청 수신');
    const { story } = req.body;
    
    if (!story) {
      console.log('스토리가 없음');
      return res.status(400).json({ 
        success: false, 
        error: '스토리가 제공되지 않았습니다.' 
      });
    }

    console.log('스토리 내용:', story.substring(0, 100) + '...');

    // 스토리 분석 (간단한 키워드 기반 분석)
    const analysis = promptGenerator.analyzeStory(story);
    
    console.log('분석 완료');
    
    res.json({ 
      success: true, 
      analysis 
    });
  } catch (error) {
    console.error('스토리 분석 오류:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || '서버 오류가 발생했습니다.' 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🎬 Sora Video Prompt Generator`);
  console.log(`📡 Server running on http://localhost:${PORT}`);
  console.log(`🚀 Ready to generate prompts!`);
});
