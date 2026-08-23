#include <huxerui/huxerui.h>

#if defined(__ANDROID__)
#include <huxerui/android/external_texture.h>
#include <huxerui/android/jni.h>
#include <huxerui/android/platform_module.h>
#include <huxerui/android/platform_view.h>
#elif defined(__EMSCRIPTEN__)
#include <huxerui/web/external_texture.h>
#include <huxerui/web/navigation.h>
#include <huxerui/web/platform_view.h>
#elif defined(_WIN32)
#include <huxerui/windows/external_texture.h>
#include <huxerui/windows/platform_view.h>
#elif defined(__APPLE__)
#include <TargetConditionals.h>
#if TARGET_OS_IPHONE
#include <huxerui/ios/external_texture.h>
#include <huxerui/ios/platform_view.h>
#else
#include <huxerui/macos/external_texture.h>
#include <huxerui/macos/platform_view.h>
#endif
#elif defined(__linux__)
#include <huxerui/linux/external_texture.h>
#endif

#include <concepts>
#include <cstddef>
#include <string>
#include <string_view>
#include <type_traits>
#include <utility>
#include <vector>

namespace {

using namespace huxerui;

template <class T, class... Arguments>
concept PubliclyConstructible = requires(Arguments&&... arguments) { T(std::forward<Arguments>(arguments)...); };

static_assert(std::same_as<decltype(UseState(1)), State<int>>);
static_assert(std::same_as<decltype(std::declval<const State<int>&>().Get()), const int&>);
static_assert(std::same_as<decltype(std::declval<const State<int>&>().operator->()), const int*>);
static_assert(requires(const State<int>& state) {
  state = 2;
  state += 1;
  state.Update([](int& value) { ++value; });
});
static_assert(requires(const StateList<std::string>& values) {
  { values.Size() } -> std::same_as<std::size_t>;
  { values.Empty() } -> std::same_as<bool>;
  values.PushBack("value");
  values.Insert(0, "value");
  values.Set(0, "value");
  values.Erase(0);
  values.Move(0, 0);
  values.Clear();
});

static_assert(ViewportClass::Compact != ViewportClass::Medium);
static_assert(ViewportClass::Medium != ViewportClass::Expanded);
static_assert(std::same_as<decltype(UseViewportClass()), ViewportClass>);
static_assert(requires(View view) {
  std::move(view).OnClick([] {});
  std::move(view).On<ViewEvents::FocusChanged>([](bool) {});
  std::move(view).With(Padding(8.0F));
  std::move(view).Key("stable-key");
});

static_assert(PubliclyConstructible<Text, std::string_view, TextRole>);
static_assert(PubliclyConstructible<Button, StringResource>);
static_assert(PubliclyConstructible<TextField, TextEditingValue>);
static_assert(PubliclyConstructible<TextField, const State<TextEditingValue>&>);
static_assert(PubliclyConstructible<Checkbox, StringVariant, const State<bool>&>);
static_assert(PubliclyConstructible<Slider, const State<float>&>);
static_assert(PubliclyConstructible<Image, ImageResource>);
static_assert(PubliclyConstructible<Image, VectorAsset>);
static_assert(PubliclyConstructible<Image, ExternalTexture>);
static_assert(PubliclyConstructible<Canvas, CanvasPainter>);
static_assert(PubliclyConstructible<ScrollView, View>);
static_assert(PubliclyConstructible<SelectionArea, View>);
static_assert(requires(TextField field, ValidationResult validation, TextInputConfiguration configuration) {
  { std::move(field).Label("Email") } -> std::same_as<TextField>;
  { std::move(field).LineLimits(TextFieldLineLimits::MultiLine(2, 5)) } -> std::same_as<TextField>;
  { std::move(field).Validation(std::move(validation)) } -> std::same_as<TextField>;
  { std::move(field).InputConfiguration(configuration) } -> std::same_as<TextField>;
  { std::move(field).OnChanged([](const TextEditingValue&) {}) } -> std::same_as<TextField>;
  { std::move(field).OnSubmitted([] {}) } -> std::same_as<TextField>;
});

static_assert(TextAffinity::Upstream != TextAffinity::Downstream);
static_assert(TextInputType::Text != TextInputType::Email);
static_assert(TextInputAction::Done != TextInputAction::Search);
static_assert(ValidationStatus::None != ValidationStatus::Invalid);
static_assert(std::same_as<decltype(TextEditingValue::FromText("text")), TextEditingValue>);
static_assert(std::same_as<decltype(Validate(std::string_view{}, Required(), EmailAddress())), ValidationResult>);

static_assert(PubliclyConstructible<ResourceId, std::string, std::string>);
static_assert(PubliclyConstructible<StringVariant, StringResource>);
static_assert(std::same_as<decltype(UseString(StringResource("app", "text"))), std::string>);
static_assert(std::same_as<decltype(UseImage(ImageResource("app", "image"))), ImageAsset>);
static_assert(std::same_as<decltype(UseRawResource(RawResource("app", "raw"))), RawAsset>);
static_assert(requires(const RawAsset& asset) {
  { asset.Bytes() };
  { asset.AsStringView() } -> std::same_as<std::string_view>;
});

static_assert(Easing::Linear != Easing::EaseInOut);
static_assert(RepeatMode::Restart != RepeatMode::Reverse);
static_assert(std::same_as<decltype(AnimationSpec(TweenSpec{})), AnimationSpec>);
static_assert(requires(MotionController& controller, const FrameInfo& frame) {
  controller.Set(0.0F);
  controller.AnimateTo(1.0F, TweenSpec{});
  { controller.Advance(frame) } -> std::same_as<MotionAdvanceResult>;
});
static_assert(requires(View view, Indication indication) {
  std::move(view).With(std::move(indication));
});
static_assert(std::same_as<decltype(FocusRing {.color = Color::Black()}), FocusRing>);

struct ContractRoute {
  int id = 0;
  bool operator==(const ContractRoute&) const = default;
};

static_assert(requires(NavigationPath<ContractRoute> path, ContractRoute route) {
  { path.Empty() } -> std::same_as<bool>;
  { path.Size() } -> std::same_as<std::size_t>;
  { path.Routes() } -> std::same_as<std::span<const ContractRoute>>;
  NavigationPath<ContractRoute>({route});
});
static_assert(requires(RouteNavigationController<ContractRoute> controller, ContractRoute route,
                       NavigationPath<ContractRoute> path) {
  controller.Push(route);
  controller.Pop();
  controller.Replace(route);
  controller.SetPath(path);
  { controller.CanPop() } -> std::same_as<bool>;
  { controller.Depth() } -> std::same_as<std::size_t>;
});

static_assert(HttpMethod::Get != HttpMethod::Post);
static_assert(HttpErrorCode::Transport != HttpErrorCode::Timeout);
static_assert(std::same_as<decltype(std::declval<HttpClient>().Send(HttpRequest{})), Task<HttpResult>>);
static_assert(FileErrorCode::NotFound != FileErrorCode::Io);
static_assert(std::same_as<decltype(std::declval<File>().ReadBytesAsync()), Task<FileResult<std::vector<std::byte>>>>);
static_assert(std::same_as<decltype(Delay(std::chrono::duration<double>{0.0})), Task<void>>);
static_assert(requires(TaskScope scope, Task<void> task, TaskHandle handle) {
  scope.Launch(std::move(task));
  handle.Cancel();
});

static_assert(MainAxisAlignment::Start != MainAxisAlignment::SpaceBetween);
static_assert(CrossAxisAlignment::Start != CrossAxisAlignment::Stretch);
static_assert(ImageFit::Contain != ImageFit::Cover);
static_assert(requires(PaintContext& context, Rect bounds, Color color, Path path) {
  context.DrawRect(bounds, color);
  context.FillPath(path, color);
  context.PushClip(bounds);
  context.PopClip();
});

static_assert(SemanticRole::Button != SemanticRole::TextField);
static_assert(SemanticActionKind::Activate != SemanticActionKind::SetText);
static_assert(std::same_as<decltype(Semantics{.role = SemanticRole::Button, .label = "Control"}), Semantics>);

static_assert(PubliclyConstructible<Application, RootFactory, AppOptions>);
static_assert(ApplicationLifecycleState::Active != ApplicationLifecycleState::Background);
static_assert(std::same_as<decltype(UseApplication()), ApplicationHandle>);
static_assert(std::same_as<decltype(UseWindow()), WindowHandle>);
static_assert(WindowContentMode::SafeArea != WindowContentMode::EdgeToEdge);
static_assert(WindowChromeMode::System != WindowChromeMode::Custom);

static_assert(PubliclyConstructible<PlatformPayload, std::nullptr_t>);
static_assert(PubliclyConstructible<PlatformView, std::string, PlatformPayload>);
static_assert(std::move_constructible<PlatformInstance>);
static_assert(!std::copy_constructible<PlatformInstance>);
static_assert(requires(PlatformInstance& instance, PlatformRequestId request) {
  { instance.Cancel(request) } -> std::same_as<bool>;
  instance.Close();
});

} // namespace
