import { EditorElement, ElementStyles } from "./editor-types"
import { nanoid } from "nanoid"

/**
 * Parses HTML string and converts it to EditorElements
 * Handles inline styles and external CSS
 */
export function parseHtmlToElements(
  htmlContent: string,
  cssContent?: string
): EditorElement[] {
  const parser = new DOMParser()
  const doc = parser.parseFromString(htmlContent, "text/html")
  
  // Parse CSS if provided
  const styleMap = cssContent ? parseCssToMap(cssContent) : new Map<string, Partial<CSSStyleDeclaration>>()
  
  // Also extract styles from <style> tags in HTML
  const styleTags = doc.querySelectorAll("style")
  styleTags.forEach(tag => {
    const cssMap = parseCssToMap(tag.textContent || "")
    cssMap.forEach((value, key) => styleMap.set(key, value))
  })
  
  // Get body content or fallback to documentElement
  const rootElement = doc.body || doc.documentElement
  
  // Convert DOM nodes to EditorElements
  const elements = convertNodesToElements(rootElement, styleMap)
  
  return elements
}

/**
 * Parse CSS string into a map of selectors to styles
 */
function parseCssToMap(css: string): Map<string, Partial<CSSStyleDeclaration>> {
  const map = new Map<string, Partial<CSSStyleDeclaration>>()
  
  // Remove comments
  const cleanCss = css.replace(/\/\*[\s\S]*?\*\//g, "")
  
  // Match CSS rules
  const ruleRegex = /([^{]+)\{([^}]+)\}/g
  let match
  
  while ((match = ruleRegex.exec(cleanCss)) !== null) {
    const selectors = match[1].trim().split(",").map(s => s.trim())
    const declarations = match[2].trim()
    
    const styles = parseDeclarations(declarations)
    
    selectors.forEach(selector => {
      map.set(selector, { ...map.get(selector), ...styles })
    })
  }
  
  return map
}

/**
 * Parse CSS declarations into an object
 */
function parseDeclarations(declarations: string): Record<string, string> {
  const styles: Record<string, string> = {}
  
  declarations.split(";").forEach(declaration => {
    const [property, value] = declaration.split(":").map(s => s.trim())
    if (property && value) {
      // Convert kebab-case to camelCase
      const camelProperty = property.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
      styles[camelProperty] = value
    }
  })
  
  return styles
}

/**
 * Convert DOM nodes to EditorElements recursively
 */
function convertNodesToElements(
  node: Element,
  styleMap: Map<string, Partial<CSSStyleDeclaration>>,
  parentId?: string
): EditorElement[] {
  const elements: EditorElement[] = []
  
  Array.from(node.children).forEach((child, index) => {
    const element = convertNodeToElement(child as HTMLElement, styleMap, index, parentId)
    if (element) {
      elements.push(element)
      
      // Recursively process children if it's a container
      if (element.type === "section" || element.type === "container") {
        const childElements = convertNodesToElements(child as Element, styleMap, element.id)
        elements.push(...childElements)
      }
    }
  })
  
  return elements
}

/**
 * Convert a single DOM node to an EditorElement
 */
function convertNodeToElement(
  node: HTMLElement,
  styleMap: Map<string, Partial<CSSStyleDeclaration>>,
  index: number,
  parentId?: string
): EditorElement | null {
  const tagName = node.tagName.toLowerCase()
  
  // Skip script and style tags
  if (tagName === "script" || tagName === "style" || tagName === "link") {
    return null
  }
  
  // Get computed styles from class and inline
  const computedStyles = getComputedElementStyles(node, styleMap)
  const editorStyles = convertCssToEditorStyles(computedStyles)
  
  // Determine element type based on tag
  const type = getElementType(tagName)
  
  // Get content
  const content = getElementContent(node, type)
  
  const element: EditorElement = {
    id: nanoid(),
    type,
    content,
    styles: editorStyles,
    position: {
      x: 0,
      y: index * 100, // Stack elements vertically
    },
    size: {
      width: type === "section" ? "100%" : "auto",
      height: "auto",
    },
    parentId,
    visible: true,
    locked: false,
  }
  
  // Add specific properties based on type
  if (type === "image") {
    element.src = (node as HTMLImageElement).src || ""
    element.alt = (node as HTMLImageElement).alt || ""
  }
  
  if (type === "link") {
    element.href = (node as HTMLAnchorElement).href || "#"
  }
  
  // Preserve original HTML for complex elements
  if (type === "html") {
    element.htmlContent = node.outerHTML
  }
  
  return element
}

/**
 * Get combined styles from classes and inline styles
 */
function getComputedElementStyles(
  node: HTMLElement,
  styleMap: Map<string, Partial<CSSStyleDeclaration>>
): Record<string, string> {
  const styles: Record<string, string> = {}
  
  // Apply class styles
  const classes = Array.from(node.classList)
  classes.forEach(className => {
    const classStyles = styleMap.get(`.${className}`)
    if (classStyles) {
      Object.assign(styles, classStyles)
    }
  })
  
  // Apply tag styles
  const tagStyles = styleMap.get(node.tagName.toLowerCase())
  if (tagStyles) {
    Object.assign(styles, tagStyles)
  }
  
  // Apply ID styles
  if (node.id) {
    const idStyles = styleMap.get(`#${node.id}`)
    if (idStyles) {
      Object.assign(styles, idStyles)
    }
  }
  
  // Apply inline styles (highest priority)
  const inlineStyle = node.getAttribute("style")
  if (inlineStyle) {
    const inlineStyles = parseDeclarations(inlineStyle)
    Object.assign(styles, inlineStyles)
  }
  
  return styles
}

/**
 * Convert CSS properties to EditorStyles
 */
function convertCssToEditorStyles(css: Record<string, string>): ElementStyles {
  return {
    backgroundColor: css.backgroundColor || css.background?.split(" ")[0] || "transparent",
    color: css.color || "#ffffff",
    fontSize: parseInt(css.fontSize) || 16,
    fontWeight: (css.fontWeight as ElementStyles["fontWeight"]) || "normal",
    fontFamily: css.fontFamily || "Inter",
    textAlign: (css.textAlign as ElementStyles["textAlign"]) || "left",
    padding: parsePadding(css),
    margin: parseMargin(css),
    borderRadius: parseInt(css.borderRadius) || 0,
    borderWidth: parseInt(css.borderWidth) || 0,
    borderColor: css.borderColor || "transparent",
    borderStyle: (css.borderStyle as ElementStyles["borderStyle"]) || "solid",
    opacity: parseFloat(css.opacity) || 1,
    boxShadow: css.boxShadow || "none",
  }
}

/**
 * Parse padding values
 */
function parsePadding(css: Record<string, string>): ElementStyles["padding"] {
  if (css.padding) {
    const values = css.padding.split(" ").map(v => parseInt(v) || 0)
    if (values.length === 1) {
      return { top: values[0], right: values[0], bottom: values[0], left: values[0] }
    }
    if (values.length === 2) {
      return { top: values[0], right: values[1], bottom: values[0], left: values[1] }
    }
    if (values.length === 4) {
      return { top: values[0], right: values[1], bottom: values[2], left: values[3] }
    }
  }
  
  return {
    top: parseInt(css.paddingTop) || 0,
    right: parseInt(css.paddingRight) || 0,
    bottom: parseInt(css.paddingBottom) || 0,
    left: parseInt(css.paddingLeft) || 0,
  }
}

/**
 * Parse margin values
 */
function parseMargin(css: Record<string, string>): ElementStyles["margin"] {
  if (css.margin) {
    const values = css.margin.split(" ").map(v => parseInt(v) || 0)
    if (values.length === 1) {
      return { top: values[0], right: values[0], bottom: values[0], left: values[0] }
    }
    if (values.length === 2) {
      return { top: values[0], right: values[1], bottom: values[0], left: values[1] }
    }
    if (values.length === 4) {
      return { top: values[0], right: values[1], bottom: values[2], left: values[3] }
    }
  }
  
  return {
    top: parseInt(css.marginTop) || 0,
    right: parseInt(css.marginRight) || 0,
    bottom: parseInt(css.marginBottom) || 0,
    left: parseInt(css.marginLeft) || 0,
  }
}

/**
 * Determine EditorElement type from HTML tag
 */
function getElementType(tagName: string): EditorElement["type"] {
  const typeMap: Record<string, EditorElement["type"]> = {
    h1: "heading",
    h2: "heading",
    h3: "heading",
    h4: "heading",
    h5: "heading",
    h6: "heading",
    p: "text",
    span: "text",
    div: "container",
    section: "section",
    header: "section",
    footer: "section",
    main: "section",
    article: "section",
    aside: "container",
    nav: "container",
    img: "image",
    a: "link",
    button: "button",
    input: "input",
    textarea: "input",
    form: "container",
    ul: "container",
    ol: "container",
    li: "text",
    video: "video",
    iframe: "html",
    svg: "icon",
  }
  
  return typeMap[tagName] || "html"
}

/**
 * Extract content from element based on type
 */
function getElementContent(node: HTMLElement, type: EditorElement["type"]): string {
  switch (type) {
    case "heading":
    case "text":
    case "button":
    case "link":
      return node.textContent?.trim() || ""
    case "image":
      return (node as HTMLImageElement).alt || ""
    default:
      return ""
  }
}

/**
 * Export EditorElements back to HTML
 */
export function exportElementsToHtml(elements: EditorElement[]): string {
  const rootElements = elements.filter(el => !el.parentId)
  
  let html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Exported Page</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Inter, sans-serif; }
  </style>
</head>
<body>
`
  
  rootElements.forEach(element => {
    html += elementToHtml(element, elements, 1)
  })
  
  html += `</body>
</html>`
  
  return html
}

/**
 * Convert single element to HTML
 */
function elementToHtml(
  element: EditorElement,
  allElements: EditorElement[],
  indent: number
): string {
  const indentStr = "  ".repeat(indent)
  const styles = stylesToCss(element.styles)
  const positionStyles = `position: absolute; left: ${element.position.x}px; top: ${element.position.y}px;`
  const sizeStyles = `width: ${element.size.width}; height: ${element.size.height};`
  const allStyles = `${styles} ${positionStyles} ${sizeStyles}`
  
  const children = allElements.filter(el => el.parentId === element.id)
  
  switch (element.type) {
    case "heading":
      return `${indentStr}<h2 style="${allStyles}">${element.content}</h2>\n`
    case "text":
      return `${indentStr}<p style="${allStyles}">${element.content}</p>\n`
    case "image":
      return `${indentStr}<img src="${element.src}" alt="${element.alt}" style="${allStyles}" />\n`
    case "button":
      return `${indentStr}<button style="${allStyles}">${element.content}</button>\n`
    case "link":
      return `${indentStr}<a href="${element.href}" style="${allStyles}">${element.content}</a>\n`
    case "icon":
      return `${indentStr}<span style="${allStyles}">${element.iconName || "icon"}</span>\n`
    case "section":
    case "container": {
      let html = `${indentStr}<div style="${allStyles} position: relative;">\n`
      children.forEach(child => {
        html += elementToHtml(child, allElements, indent + 1)
      })
      html += `${indentStr}</div>\n`
      return html
    }
    case "html":
      return element.htmlContent || ""
    default:
      return `${indentStr}<div style="${allStyles}">${element.content}</div>\n`
  }
}

/**
 * Convert ElementStyles to CSS string
 */
function stylesToCss(styles: ElementStyles): string {
  const parts: string[] = []
  
  if (styles.backgroundColor !== "transparent") {
    parts.push(`background-color: ${styles.backgroundColor}`)
  }
  if (styles.color) {
    parts.push(`color: ${styles.color}`)
  }
  if (styles.fontSize) {
    parts.push(`font-size: ${styles.fontSize}px`)
  }
  if (styles.fontWeight !== "normal") {
    parts.push(`font-weight: ${styles.fontWeight}`)
  }
  if (styles.fontFamily) {
    parts.push(`font-family: ${styles.fontFamily}`)
  }
  if (styles.textAlign !== "left") {
    parts.push(`text-align: ${styles.textAlign}`)
  }
  if (styles.borderRadius) {
    parts.push(`border-radius: ${styles.borderRadius}px`)
  }
  if (styles.borderWidth) {
    parts.push(`border: ${styles.borderWidth}px ${styles.borderStyle} ${styles.borderColor}`)
  }
  if (styles.opacity !== 1) {
    parts.push(`opacity: ${styles.opacity}`)
  }
  if (styles.boxShadow !== "none") {
    parts.push(`box-shadow: ${styles.boxShadow}`)
  }
  if (styles.padding) {
    parts.push(`padding: ${styles.padding.top}px ${styles.padding.right}px ${styles.padding.bottom}px ${styles.padding.left}px`)
  }
  if (styles.margin) {
    parts.push(`margin: ${styles.margin.top}px ${styles.margin.right}px ${styles.margin.bottom}px ${styles.margin.left}px`)
  }
  
  return parts.join("; ")
}
