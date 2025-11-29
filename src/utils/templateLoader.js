const fs = require('fs');
const path = require('path');

class TemplateLoader {
  constructor() {
    this.templatesPath = path.join(__dirname, '../../templates');
  }

  /**
   * 모든 템플릿 목록 가져오기
   */
  getAllTemplates() {
    const templates = [];
    
    try {
      const files = fs.readdirSync(this.templatesPath);
      
      files.forEach(file => {
        if (path.extname(file) === '.json') {
          const templatePath = path.join(this.templatesPath, file);
          const template = this.loadTemplate(path.basename(file, '.json'));
          
          if (template) {
            templates.push({
              id: path.basename(file, '.json'),
              filename: file,
              ...template
            });
          }
        }
      });
    } catch (error) {
      console.error('템플릿 로드 오류:', error);
    }

    return templates;
  }

  /**
   * 특정 템플릿 로드
   */
  loadTemplate(templateId) {
    try {
      const templatePath = path.join(this.templatesPath, `${templateId}.json`);
      
      if (fs.existsSync(templatePath)) {
        const content = fs.readFileSync(templatePath, 'utf-8');
        return JSON.parse(content);
      }
    } catch (error) {
      console.error(`템플릿 로드 실패 (${templateId}):`, error);
    }
    
    return null;
  }

  /**
   * 템플릿 저장
   */
  saveTemplate(templateId, data) {
    try {
      const templatePath = path.join(this.templatesPath, `${templateId}.json`);
      fs.writeFileSync(templatePath, JSON.stringify(data, null, 2), 'utf-8');
      return true;
    } catch (error) {
      console.error(`템플릿 저장 실패 (${templateId}):`, error);
      return false;
    }
  }

  /**
   * 기본 템플릿 구조 반환
   */
  getDefaultTemplate() {
    return {
      name: "기본 템플릿",
      description: "Sora 영상 프롬프트 기본 템플릿",
      technicalSpecs: {
        shootingFormat: "실사",
        camera: "",
        lens: "",
        technique: "",
        filmTone: "",
        colorGrading: "",
        specialEffects: "",
        lightSource: "",
        timeOfDay: "",
        primaryColor: "",
        secondaryColor: ""
      },
      environment: {
        location: "",
        terrain: "",
        weather: "",
        time: "",
        features: "",
        mood: ""
      },
      character: {
        description: "",
        role: "",
        costume: {
          head: "",
          top: "",
          accessories: "",
          bottom: "",
          shoes: ""
        }
      },
      scenes: {
        overview: {
          duration: "",
          startingSituation: "",
          cameraMovement: ""
        },
        shots: []
      },
      sound: {
        ambient: [],
        character: [],
        mechanical: [],
        music: ""
      },
      dialogue: {
        lines: []
      },
      specialInstructions: {
        must: [],
        emphasize: [],
        avoid: []
      }
    };
  }
}

module.exports = new TemplateLoader();
