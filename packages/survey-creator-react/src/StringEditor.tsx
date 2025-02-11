import React from "react";
import { LocalizableString, Serializer, JsonObjectProperty, Base } from "survey-core";
import { ReactElementFactory, SurveyElementBase, SvgIcon } from "survey-react-ui";
import { CreatorBase, StringEditorViewModelBase, editableStringRendererName } from "survey-creator-core";
import { CreatorModelElement } from "./ModelElement";

export class SurveyLocStringEditor extends CreatorModelElement<any, any> {
  private baseModel: StringEditorViewModelBase;
  private svStringEditorRef: React.RefObject<HTMLDivElement>;
  constructor(props: any) {
    super(props);
    this.state = { changed: 0 };
    this.svStringEditorRef = React.createRef();
  }
  protected createModel(): void {
    this.baseModel = new StringEditorViewModelBase(this.locString, this.creator);
    this.baseModel.blurEditor = () => {
      this.svStringEditorRef.current.blur();
      this.svStringEditorRef.current.spellcheck = false;
    };
  }
  protected getUpdatedModelProps(): string[] {
    return ["creator", "locString"];
  }
  private get locString(): LocalizableString {
    return this.props.locStr.locStr;
  }
  private get creator(): CreatorBase {
    return this.props.locStr.creator;
  }
  private get style(): any {
    return this.props.style;
  }

  protected getStateElement(): Base {
    return this.baseModel;
  }

  public get errorText(): string {
    return this.baseModel.errorText;
  }
  private onChangedHandler = (sender: any, options: any) => {
    this.setState({ changed: !!this.state && this.state.changed ? this.state.changed + 1 : 1 });
  }
  public componentDidMount() {
    super.componentDidMount();
    if (!this.locString) return;
    const self: SurveyLocStringEditor = this;

    this.locString.onStringChanged.add(this.onChangedHandler);
    if (this.locString["__isEditing"]) {
      this.svStringEditorRef.current.focus();
      // document.execCommand('selectAll', false, null);
    }
  }
  public componentWillUnmount() {
    super.componentWillUnmount();
    if (!this.locString) return;
    this.locString.onStringChanged.remove(this.onChangedHandler);
  }
  private get placeholder(): string {
    return this.baseModel.placeholder;
  }
  private get contentEditable(): boolean {
    return this.baseModel.contentEditable;
  }
  private onBlur = (event: any) => {
    this.svStringEditorRef.current.spellcheck = false;
    this.locString["__isEditing"] = false;
    this.justFocused = false;
    this.baseModel.onBlur(event.nativeEvent);
    return this.baseModel.errorText;
  };
  private onCompositionStart = (event: any) => {
    this.baseModel.onCompositionStart(event.nativeEvent);
  };
  private onCompositionEnd = (event: any) => {
    this.baseModel.onCompositionEnd(event.nativeEvent);
  };
  private onInput = (event: any) => {
    this.baseModel.onInput(event.nativeEvent);
  };
  private justFocused = false;
  private onFocus = (event: any) => {
    this.baseModel.onFocus(event.nativeEvent);
    this.justFocused = true;
  };
  private onKeyDown = (event: React.KeyboardEvent<HTMLSpanElement>) => {
    return this.baseModel.onKeyDown(event.nativeEvent);
  };
  private onKeyUp = (event: React.KeyboardEvent<HTMLSpanElement>) => {
    return this.baseModel.onKeyUp(event.nativeEvent);
  };
  private onMouseUp = (event: React.MouseEvent<HTMLSpanElement>): boolean => {
    return this.baseModel.onMouseUp(event.nativeEvent);
  };
  private done = (event: any) => {
    this.baseModel.done(event);
    this.locString["__isEditing"] = false;
  };
  private edit = (event: any) => {
    this.svStringEditorRef.current.focus();
    // document.execCommand('selectAll', false, null);
    this.locString["__isEditing"] = true;
    this.baseModel.onClick(event);
  };
  private get className() {
    return this.baseModel.className(this.locString.renderedHtml);
  }
  public render(): JSX.Element {
    if (!this.locString) {
      return null;
    }
    else {
      this.baseModel.setLocString(this.locString);
    }
    let control = null;
    if (this.locString.hasHtml) {
      const htmlValue = { __html: this.baseModel.focused && this.baseModel.editAsText && this.locString.text || this.locString.renderedHtml };
      control = (
        <span
          role="textbox"
          ref={this.svStringEditorRef}
          className="sv-string-editor"
          contentEditable={this.contentEditable}
          spellCheck={false}
          aria-placeholder={this.placeholder}
          suppressContentEditableWarning={true}
          // style={this.style}
          dangerouslySetInnerHTML={htmlValue}
          onBlur={this.onBlur}
          onFocus={this.onFocus}
          onKeyDown={this.onKeyDown}
          onMouseUp={this.onMouseUp}
          onClick={this.edit}
        />
      );
    } else {
      control = (
        <span
          role="textbox"
          ref={this.svStringEditorRef}
          className="sv-string-editor"
          contentEditable={this.contentEditable}
          spellCheck={false}
          aria-placeholder={this.placeholder}
          suppressContentEditableWarning={true}
          // style={this.style}
          onBlur={this.onBlur}
          onInput={this.onInput}
          onCompositionStart={this.onCompositionStart}
          onCompositionEnd={this.onCompositionEnd}
          onFocus={this.onFocus}
          onKeyDown={this.onKeyDown}
          onKeyUp={this.onKeyUp}
          onMouseUp={this.onMouseUp}
          onClick={this.edit}
        >
          {this.locString.renderedHtml}
        </span>
      );
    }
    return (
      <span className={this.className}>
        <span className="svc-string-editor__content">
          <div className="svc-string-editor__border"
            onClick={this.edit}
          >
            <SvgIcon
              className="svc-string-editor__button svc-string-editor__button--edit"
              size={16}
              iconName={"icon-edit"}
            ></SvgIcon>

          </div>
          {control}
          <div className="svc-string-editor__controls"
            onClick={this.edit}>
          </div>
        </span>
        {this.errorText ? <span className="svc-string-editor__error">{this.errorText}</span> : ""}
      </span>
    );
  }
}

ReactElementFactory.Instance.registerElement(
  editableStringRendererName,
  (props) => {
    return React.createElement(SurveyLocStringEditor, props);
  }
);
