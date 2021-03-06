<?php
/**
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade this module
 * to newer versions in the future.
 */
declare(strict_types=1);

namespace Smile\DebugToolbar\Layout;

use Magento\Framework\View\Layout\BuilderInterface;
use Magento\Framework\View\LayoutInterface;

/**
 * Mock of layout builder to avoid layout rebuild.
 */
class Builder implements BuilderInterface
{
    /**
     * @var LayoutInterface
     */
    protected $layout;

    /**
     * @param LayoutInterface $layout
     */
    public function __construct(LayoutInterface $layout)
    {
        $this->layout = $layout;
    }

    /**
     * @inheritdoc
     */
    public function build()
    {
        return $this->layout;
    }
}
